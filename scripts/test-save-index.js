/**
 * Script de Teste - Simular Salvamento do Editor Visual
 * 
 * Testa se a API /save-visual-edits está funcionando corretamente
 * com um payload real da página Index
 */

const payload = {
  pageId: 'index',
  edits: {
    'index.fisicoEspiritual.title': 'TESTE - Seus desafios têm origem física ou espiritual?'
  }
};

console.log('🧪 Testando salvamento...\n');
console.log('📦 Payload:', JSON.stringify(payload, null, 2));

fetch('http://localhost:3001/api/save-visual-edits', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
  .then(res => {
    console.log('\n📡 Status HTTP:', res.status, res.statusText);
    return res.text(); // Pegar como texto primeiro
  })
  .then(text => {
    console.log('\n📄 Resposta raw:', text);
    const data = JSON.parse(text);
    console.log('\n✅ Resposta da API:', JSON.stringify(data, null, 2));
    
    // Verificar se salvou corretamente
    return fetch('http://localhost:3001/api/content/index');
  })
  .then(res => res.json())
  .then(data => {
    const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    console.log('\n📊 Valor salvo no DB:');
    console.log('   fisicoEspiritual.title =', content.fisicoEspiritual.title);
    
    if (content.fisicoEspiritual.title.includes('TESTE')) {
      console.log('\n🎉 SUCESSO! O salvamento funcionou!');
    } else {
      console.log('\n❌ FALHA! O valor não foi salvo.');
    }
  })
  .catch(error => {
    console.error('\n❌ Erro:', error.message);
  });
