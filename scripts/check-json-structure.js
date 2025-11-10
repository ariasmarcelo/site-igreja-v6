/**
 * Verificar estrutura real do JSON no banco
 */

fetch('http://localhost:3001/api/content/index')
  .then(res => res.json())
  .then(data => {
    const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    
    console.log('🔍 Estrutura do JSON:');
    console.log('📊 Chaves principais:', Object.keys(content));
    console.log('\n📋 fisicoEspiritual existe?', content.fisicoEspiritual !== undefined);
    
    if (content.fisicoEspiritual) {
      console.log('📋 fisicoEspiritual.title existe?', content.fisicoEspiritual.title !== undefined);
      console.log('📋 Valor atual:', content.fisicoEspiritual.title);
      console.log('\n📊 Chaves de fisicoEspiritual:', Object.keys(content.fisicoEspiritual));
    } else {
      console.log('❌ fisicoEspiritual NÃO EXISTE no JSON!');
    }
  })
  .catch(error => {
    console.error('❌ Erro:', error.message);
  });
