// Vercel Serverless Function - Save JSON
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Converte pageId para PascalCase
 */
function toPascalCase(pageId) {
  return pageId
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Sincroniza JSONs de fallback GRANULARES
 */
function syncGranularFiles(obj, pageName, currentPath = '', baseDir) {
  let filesCreated = 0;
  let filesUpdated = 0;
  let filesSkipped = 0;

  function traverse(current, path) {
    if (current === null || current === undefined) return;

    if (Array.isArray(current)) {
      current.forEach((item, index) => {
        traverse(item, `${path}[${index}]`);
      });
      return;
    }

    if (typeof current === 'object') {
      for (const key in current) {
        if (current.hasOwnProperty(key)) {
          const newPath = path ? `${path}.${key}` : key;
          traverse(current[key], newPath);
        }
      }
      return;
    }

    // Valor primitivo - criar arquivo
    const fileName = `${pageName}.${path}.json`;
    const filePath = path.join(baseDir, fileName);
    const fileContent = JSON.stringify(current, null, 2);

    let shouldWrite = false;

    if (fs.existsSync(filePath)) {
      const existingContent = fs.readFileSync(filePath, 'utf-8');
      if (existingContent !== fileContent) {
        shouldWrite = true;
        filesUpdated++;
      } else {
        filesSkipped++;
      }
    } else {
      shouldWrite = true;
      filesCreated++;
    }

    if (shouldWrite) {
      fs.writeFileSync(filePath, fileContent, 'utf-8');
    }
  }

  traverse(obj, currentPath);
  return { filesCreated, filesUpdated, filesSkipped };
}

function syncFallbackJson(pageId, dbContent) {
  try {
    const pageName = toPascalCase(pageId);
    const baseDir = path.join(process.cwd(), 'src', 'locales', 'pt-BR');
    
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const stats = syncGranularFiles(dbContent, pageName, '', baseDir);
    console.log(`[SYNC] ✅ ${pageName}: Criados=${stats.filesCreated}, Atualizados=${stats.filesUpdated}`);
    
    return { success: true, pageName, stats };
  } catch (error) {
    console.error(`[SYNC] ❌ Erro: ${error.message}`);
    return { success: false, error: error.message };
  }
/**
 * Percorre objeto e extrai entries granulares para text_entries
 * Retorna array de { json_key, content } para upsert
 */
function extractGranularEntries(obj, pageId, currentPath = '') {
  const entries = [];

  function traverse(current, path) {
    if (current === null || current === undefined) return;

    if (Array.isArray(current)) {
      current.forEach((item, index) => {
        traverse(item, `${path}[${index}]`);
      });
      return;
    }

    if (typeof current === 'object') {
      for (const key in current) {
        if (current.hasOwnProperty(key)) {
          const newPath = path ? `${path}.${key}` : key;
          traverse(current[key], newPath);
        }
      }
      return;
    }

    // Valor primitivo - criar entry
    const jsonKey = `${pageId}.${path}`;
    entries.push({
      page_id: pageId,
      json_key: jsonKey,
      content: { 'pt-BR': current },
      updated_at: new Date().toISOString()
    });
  }

  traverse(obj, currentPath);
  return entries;
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

  try {
    const { pageId, content } = req.body;
    
    console.log(`💾 Salvando ${pageId} de forma granular...`);
    
    // Extrair entries granulares
    const entries = extractGranularEntries(content, pageId);
    
    console.log(`📝 Extraídos ${entries.length} entries granulares`);
    
    // ESTRATÉGIA: Delete + Insert (mais confiável que upsert individual)
    // 1. Deletar todas as entries antigas desta página
    const { error: deleteError } = await supabase
      .from('text_entries')
      .delete()
      .eq('page_id', pageId);
    
    if (deleteError) {
      console.error(`❌ Erro ao deletar entries antigas: ${deleteError.message}`);
      throw deleteError;
    }
    
    console.log(`🗑️  Entries antigas deletadas`);
    
    // 2. Inserir todas as novas entries
    const { error: insertError } = await supabase
      .from('text_entries')
      .insert(entries);
    
    if (insertError) {
      console.error(`❌ Erro ao inserir entries: ${insertError.message}`);
      throw insertError;
    }
    
    console.log(`✅ ${entries.length} entries inseridas com sucesso`);
    
    // SINCRONIZAÇÃO AUTOMÁTICA DE FALLBACK GRANULAR
    syncFallbackJson(pageId, content).catch(err => {
      console.error(`[SYNC] Falha na sincronização: ${err}`);
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'JSON salvo com sucesso!',
      entriesCount: entries.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
