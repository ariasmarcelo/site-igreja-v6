/**
 * Teste de Lógica - Reproduzir o processamento do servidor
 */

// Simular o que o servidor faz
const elementId = 'index.fisicoEspiritual.title';
const pageId = 'index';
const pagePrefix = `${pageId}.`;

console.log('🔍 Processando:', elementId);
console.log('📋 pagePrefix:', pagePrefix);
console.log('✓ Começa com prefix?', elementId.startsWith(pagePrefix));

let jsonKey = elementId;

if (elementId.startsWith(pagePrefix)) {
  jsonKey = elementId.substring(pagePrefix.length);
  console.log('🔧 Removido prefixo:', jsonKey);
}

console.log('\n✅ Chave final:', jsonKey);

// Testar a navegação
const testObj = {
  fisicoEspiritual: {
    title: "Valor original"
  }
};

const parts = jsonKey.replace(/\[(\d+)\]/g, '.$1').split('.');
console.log('\n📊 Parts:', parts);

let current = testObj;
for (let i = 0; i < parts.length - 1; i++) {
  const part = parts[i];
  console.log(`  Navegando para: ${part}`);
  console.log(`  Existe?`, current[part] !== undefined);
  console.log(`  Tipo:`, typeof current[part]);
  
  if (typeof current[part] !== 'object' || current[part] === null) {
    console.log(`  ❌ ERRO! Expected object at ${part}`);
    process.exit(1);
  }
  current = current[part];
}

const lastKey = parts[parts.length - 1];
console.log(`\n🎯 Chave final: "${lastKey}"`);
console.log(`📌 Valor atual: "${current[lastKey]}"`);

current[lastKey] = "NOVO VALOR TESTE";
console.log(`✅ Valor atualizado: "${current[lastKey]}"`);
console.log(`\n🔍 Objeto completo:`, JSON.stringify(testObj, null, 2));
