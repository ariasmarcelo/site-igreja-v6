// Vercel Serverless Function - Save Visual Edits (Granular System)
const { createClient } = require('@supabase/supabase-js');
const { open } = require('lmdb');
const path = require('path');
const { refreshCache } = require('./cache-refresh');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Log helper
function log(msg) {
  console.log(`[${new Date().toISOString()}] [SAVE-API] ${msg}`);
}

// Get singleton LMDB instance
function getDB() {
  if (!global.__lmdbInstance) {
    const dbPath = path.join(process.cwd(), '.cache', 'content-lmdb');
    log(`Initializing LMDB at ${dbPath}`);
    global.__lmdbInstance = open({
      path: dbPath,
      compression: true,
    });
  }
  return global.__lmdbInstance;
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const startTime = Date.now();
  try {
    const { pageId, edits } = req.body;
    
    log(`\n[SAVE-EDITS] ═══ START REQUEST ═══`);
    log(`[SAVE-EDITS] 📝 Received request - pageId: ${pageId}, edits count: ${Object.keys(edits || {}).length}`);
    
    if (!edits || typeof edits !== 'object') {
      log(`Invalid edits - type: ${typeof edits}`);
      return res.status(400).json({ success: false, message: 'Edits inválidas' });
    }
    
    // ESTRATÉGIA GRANULAR: Atualizar apenas entries específicas modificadas
    let appliedCount = 0;
    const updates = [];
    
    for (const [jsonKey, edit] of Object.entries(edits)) {
      log(`Processing edit - jsonKey: ${jsonKey}, hasNewText: ${edit.newText !== undefined}, isShared: ${edit.isShared}, targetPage: ${edit.targetPage}`);
      
      if (edit.newText === undefined) {
        log(`Skipping ${jsonKey} - no newText`);
        continue;
      }
      
      // 🌐 CONTEÚDO COMPARTILHADO: Detectar se é conteúdo compartilhado
      // Compartilhado = NÃO tem prefixo pageId (footer.*, header.*, etc.)
      const hasPagePrefix = jsonKey.startsWith(`${pageId}.`);
      const isSharedContent = !hasPagePrefix || edit.isShared === true;
      
      // 📄 PÁGINA DE DESTINO: 
      // - Se compartilhado: page_id = '__shared__'
      // - Se não compartilhado: page_id = pageId (ou targetPage se fornecido)
      const targetPageId = isSharedContent ? '__shared__' : (edit.targetPage || pageId);
      
      // ✅ NUNCA MODIFICAR json_key - usar exatamente como recebido
      // Banco armazena:
      // - Compartilhado: "footer.copyright" (SEM prefixo)
      // - Página: "tratamentos.treatments[0].details" (COM prefixo)
      
      log(`Prepared update - page_id: ${targetPageId}, json_key: ${jsonKey}, isShared: ${isSharedContent}`);
      
      updates.push({
        page_id: targetPageId,
        json_key: jsonKey,
        newText: edit.newText
      });
      
      appliedCount++;
    }
    
    // Aplicar updates individuais (upsert granular)
    log(`[SAVE-EDITS] 🗄️  Starting database upserts - ${updates.length} entries`);
    const dbStartTime = Date.now();
    
    for (const update of updates) {
      log(`[SAVE-EDITS] 💾 Upserting: page_id=${update.page_id}, json_key=${update.json_key}`);
      
      const { data, error } = await supabase
        .from('text_entries')
        .upsert({
          page_id: update.page_id,
          json_key: update.json_key,
          content: { 'pt-BR': update.newText },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'json_key'
        })
        .select();
      
      if (error) {
        log(`[SAVE-EDITS] ❌ Database error: ${error.message}, code: ${error.code}, details: ${JSON.stringify(error.details)}`);
        throw error;
      }
      
      log(`[SAVE-EDITS] ✅ Upsert successful for ${update.json_key}: ${data ? 'updated' : 'created'}`);
    }
    
    log(`[SAVE-EDITS] ✅ Database save complete (${Date.now() - dbStartTime}ms)`);
    
    log(`[SAVE-EDITS] ✅ Applied ${appliedCount}/${Object.keys(edits).length} edits for ${pageId}`);
    
    // 🔄 REFRESH CACHE: Limpar e pré-aquecer com dados frescos do banco
    // Operação encapsulada - editor não precisa saber disso
    log(`[SAVE-EDITS] 🔄 Triggering full cache refresh...`);
    const refreshStartTime = Date.now();
    const cacheRefreshResult = await refreshCache();
    log(`[SAVE-EDITS] ✨ Cache refresh complete: cleared=${cacheRefreshResult.cleared}, cached=${cacheRefreshResult.cached}/${cacheRefreshResult.total} (${Date.now() - refreshStartTime}ms)`);
    
    const totalTime = Date.now() - startTime;
    log(`[SAVE-EDITS] 🎉 REQUEST COMPLETE - Total time: ${totalTime}ms`);
    log(`[SAVE-EDITS] ═══ END REQUEST ═══\n`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Edições salvas com sucesso!',
      appliedCount,
      totalEdits: Object.keys(edits).length,
      updates: updates.map(u => ({ page_id: u.page_id, json_key: u.json_key })),
      cacheRefreshed: {
        cleared: cacheRefreshResult.cleared,
        cached: cacheRefreshResult.cached
      },
      timing: {
        total: totalTime,
        cacheRefresh: Date.now() - refreshStartTime
      }
    });
  } catch (error) {
    log(`[SAVE-EDITS] ❌ ERROR: ${error.message} (${Date.now() - startTime}ms)`);
    log(`[SAVE-EDITS] Stack: ${error.stack}`);
    log(`[SAVE-EDITS] ═══ END REQUEST (ERROR) ═══\n`);
    
    // Detailed error response
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: {
        code: error.code,
        hint: error.hint,
        details: error.details
      }
    });
  }
};
