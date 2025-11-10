/**
 * Teste Completo de Salvamento com Detalhes
 */

const testEdit = {
  pageId: 'index',
  edits: {
    'index.hero.subtitle': '🧪 TESTE AUTOMATIZADO - Purificação Espiritual'
  }
};

console.log('🧪 TESTE 1: Editar hero.subtitle (campo simples)\n');
console.log('📦 Payload:', JSON.stringify(testEdit, null, 2));

fetch('http://localhost:3001/api/save-visual-edits', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testEdit)
})
  .then(res => res.json())
  .then(data => {
    console.log('\n✅ Resposta:', JSON.stringify(data, null, 2));
    
    // Aguardar 1 segundo
    return new Promise(resolve => setTimeout(resolve, 1000));
  })
  .then(() => {
    // Buscar novamente
    return fetch('http://localhost:3001/api/content/index');
  })
  .then(res => res.json())
  .then(data => {
    const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    console.log('\n📊 Valor no DB após save:');
    console.log('   hero.subtitle =', content.hero.subtitle);
    
    if (content.hero.subtitle.includes('🧪 TESTE')) {
      console.log('\n✅ SUCESSO! O campo hero.subtitle foi salvo!');
    } else {
      console.log('\n❌ FALHA! O campo hero.subtitle NÃO foi salvo.');
    }
    
    // Agora testar fisicoEspiritual.title
    console.log('\n\n🧪 TESTE 2: Editar fisicoEspiritual.title (campo aninhado)\n');
    
    return fetch('http://localhost:3001/api/save-visual-edits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId: 'index',
        edits: {
          'index.fisicoEspiritual.title': '🧪 TESTE 2 - Física ou Espiritual?'
        }
      })
    });
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Resposta:', JSON.stringify(data, null, 2));
    return new Promise(resolve => setTimeout(resolve, 1000));
  })
  .then(() => fetch('http://localhost:3001/api/content/index'))
  .then(res => res.json())
  .then(data => {
    const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    console.log('\n📊 Valor no DB após save:');
    console.log('   fisicoEspiritual.title =', content.fisicoEspiritual.title);
    
    if (content.fisicoEspiritual.title.includes('🧪 TESTE 2')) {
      console.log('\n✅ SUCESSO! O campo fisicoEspiritual.title foi salvo!');
    } else {
      console.log('\n❌ FALHA! O campo fisicoEspiritual.title NÃO foi salvo.');
      console.log('\n🔍 Possíveis causas:');
      console.log('   1. Função updateJsonByKey retornando false');
      console.log('   2. Erro silencioso na navegação do JSON');
      console.log('   3. Problema com sanitização do texto');
    }
  })
  .catch(error => {
    console.error('\n❌ Erro:', error.message);
  });
