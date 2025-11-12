// Vercel Serverless Function - Save Visual Edits
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { pageId, edits } = req.body;
    
    console.log('═══════════════════════════════════════════');
    console.log('📥 REQUISIÇÃO RECEBIDA');
    console.log('   pageId:', pageId);
    console.log('   editsCount:', Object.keys(edits || {}).length);
    console.log('   edits COMPLETO:', JSON.stringify(edits, null, 2));
    console.log('═══════════════════════════════════════════');
    
    if (!edits || typeof edits !== 'object') {
      console.error('❌ Edits inválidas!');
      return res.status(400).json({ success: false, message: 'Edits inválidas' });
    }
    
    // Buscar conteúdo atual do Supabase
    const { data, error: fetchError } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page_id', pageId)
      .single();
    
    if (fetchError) {
      console.error('❌ Erro ao buscar:', fetchError);
      return res.status(404).json({ success: false, message: 'Página não encontrada' });
    }
    
    const content = data.content;
    console.log('📄 Conteúdo atual carregado');
    
    // Aplicar edits - formato: { elementId: { newText: "..." } }
    let appliedCount = 0;
    console.log('\n🔄 INICIANDO PROCESSAMENTO DE EDIÇÕES...\n');
    
    Object.entries(edits).forEach(([elementId, edit]) => {
      console.log(`\n━━━ Processando: ${elementId} ━━━`);
      console.log('   Edit object:', JSON.stringify(edit, null, 2));
      console.log('   newText existe?', edit.newText !== undefined);
      console.log('   newText valor:', edit.newText?.substring(0, 100));
      
      if (edit.newText !== undefined) {
        // Remover prefixo pageId. se presente (ex: "purificacao.psicodelicos.title" → "psicodelicos.title")
        let cleanElementId = elementId;
        if (elementId.startsWith(`${pageId}.`)) {
          cleanElementId = elementId.substring(pageId.length + 1);
          console.log(`   🔧 Removido prefixo: "${elementId}" → "${cleanElementId}"`);
        }
        
        // Mapear elementId para caminho no JSON
        // Aceita formato com pontos (ex: "psicodelicos.title") 
        // Também suporta arrays: "cards[1].title" ou "tripleProtection.cards[1].title"
        console.log(`   🔍 Processando caminho: ${cleanElementId}`);
        
        // Dividir por ponto, mas preservar índices de array
        const parts = cleanElementId.split('.');
        console.log('   Parts:', parts);
        
        // Navegar pelo caminho
        let current = content;
        let success = true;
        let pathStr = '';
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          
          // Verificar se é array: "cards[1]"
          const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
          
          if (arrayMatch) {
            const arrayName = arrayMatch[1];
            const index = parseInt(arrayMatch[2]);
            pathStr += `[${arrayName}][${index}]`;
            console.log(`   📋 Navegando array: ${arrayName}[${index}]`);
            
            if (current[arrayName] && Array.isArray(current[arrayName]) && current[arrayName][index]) {
              current = current[arrayName][index];
            } else {
              console.log(`   ❌ Array não encontrado ou índice inválido: ${arrayName}[${index}]`);
              success = false;
              break;
            }
          } else {
            pathStr += `[${part}]`;
            console.log(`   🔑 Navegando propriedade: ${part}`);
            
            if (i === parts.length - 1) {
              // Última parte - atualizar valor
              if (current[part] !== undefined) {
                const oldValue = current[part];
                current[part] = edit.newText;
                console.log(`   ✅ APLICADO: ${cleanElementId}`);
                console.log(`      Caminho: ${pathStr}`);
                console.log(`      Antes: "${String(oldValue).substring(0, 50)}..."`);
                console.log(`      Depois: "${edit.newText.substring(0, 50)}..."`);
                appliedCount++;
              } else {
                console.log(`   ❌ Propriedade não encontrada: ${part}`);
                success = false;
              }
            } else {
              // Parte intermediária - continuar navegando
              if (current[part] !== undefined) {
                current = current[part];
              } else {
                console.log(`   ❌ Propriedade intermediária não encontrada: ${part}`);
                success = false;
                break;
              }
            }
          }
        }
      } else {
        console.log(`   ❌ newText não definido`);
      }
    });
    
    console.log('\n📊 RESUMO:');
    console.log(`   Total de edições recebidas: ${Object.keys(edits).length}`);
    console.log(`   Total aplicado com sucesso: ${appliedCount}`);
    
    console.log(`📊 Total aplicado: ${appliedCount} de ${Object.keys(edits).length}`);
    
    // Criar uma cópia profunda para forçar o Supabase a detectar mudanças
    const updatedContent = JSON.parse(JSON.stringify(content));
    
    // Salvar de volta no Supabase
    console.log('💾 Salvando no banco...');
    const { data: updateData, error: updateError } = await supabase
      .from('page_contents')
      .update({
        content: updatedContent,
        updated_at: new Date().toISOString()
      })
      .eq('page_id', pageId)
      .select();
    
    if (updateError) {
      console.error('❌ Erro ao salvar:', updateError);
      throw updateError;
    }
    
    console.log('✅ Salvo com sucesso! Linhas afetadas:', updateData?.length || 0);
    
    // Verificar se realmente salvou
    if (!updateData || updateData.length === 0) {
      console.error('⚠️ AVISO: Nenhuma linha foi atualizada!');
      return res.status(500).json({ 
        success: false, 
        message: 'Nenhuma linha foi atualizada no banco de dados'
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Edições salvas com sucesso!',
      appliedCount,
      totalEdits: Object.keys(edits).length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
