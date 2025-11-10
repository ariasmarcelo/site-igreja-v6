# Verificação de IDs Únicos (data-json-key)

## 📋 Visão Geral

Sistema de verificação e manutenção de IDs únicos para o editor visual do site.

## 🎯 Por que é importante?

**Sem `data-json-key`**: Edições no site **NÃO SÃO SALVAS** no banco de dados.
**Com `data-json-key`**: Edições são **salvas automaticamente** no Supabase.

## ✅ Status Atual (10/11/2025)

### Páginas com IDs Completos:
- ✅ **Index.tsx** - Página inicial (hero, igreja, purificação, instituto)
- ✅ **Tratamentos.tsx** - Todos os cards de tratamentos + CTA
- ✅ **Purificacao.tsx** - Todas as fases + conteúdo
- ✅ **QuemSomos.tsx** - Histórico, princípios, magia, herméticos
- ✅ **Testemunhos.tsx** - Cards de testemunhos + badges + CTA
- ✅ **Contato.tsx** - Formulário, FAQ, horários
- ✅ **Artigos.tsx** - Hero, categorias, artigos em destaque
- ✅ **NotFound.tsx** - Página 404

### Total de Elementos Mapeados:
- **95+ elementos** com `data-json-key` único
- **8 páginas** totalmente mapeadas
- **0 páginas** com problemas conhecidos

## 🔍 Como Verificar

### Verificação Rápida (todas as páginas)

```bash
node scripts/verify-ids.js
```

### Verificação de Página Específica

```bash
node scripts/verify-ids.js --page=Tratamentos
node scripts/verify-ids.js --page=Index
```

### Output Esperado (sem problemas)

```
🔍 Verificação de data-json-key em elementos editáveis

📄 Tratamentos.tsx
   Encontrados: 45 usos de texts.xxx
   ✅ Todos os elementos têm data-json-key

📄 Testemunhos.tsx
   Encontrados: 13 usos de texts.xxx
   ✅ Todos os elementos têm data-json-key

================================================================================

📊 RESUMO:
   Páginas verificadas: 8
   Problemas encontrados: 0

✅ Todas as páginas estão corretamente mapeadas!
```

### Output com Problemas

```
📄 Tratamentos.tsx
   Encontrados: 45 usos de texts.xxx
   ⚠️  Linha 38: {texts.header.title}
       Tag: <h1 className="text-5xl font-bold">
   ❌ 1 elementos sem data-json-key

⚠️  Execute: node scripts/assign-ids-final.js
   para corrigir automaticamente os problemas.
```

## 🔧 Como Corrigir Problemas

### Correção Automática (Recomendado)

```bash
# Ver preview das mudanças (dry-run)
node scripts/assign-ids-final.js --dry-run

# Aplicar mudanças
node scripts/assign-ids-final.js

# Aplicar em página específica
node scripts/assign-ids-final.js --page=Tratamentos
```

### Correção Manual

Se preferir adicionar manualmente:

```tsx
// ANTES (não salva edições)
<h1 className="text-5xl font-bold">
  {texts.header.title}
</h1>

// DEPOIS (salva edições)
<h1 className="text-5xl font-bold" data-json-key="tratamentos.header.title">
  {texts.header.title}
</h1>
```

**Padrão de IDs**:
- `{nomeDaPagina}.{caminho.no.json}`
- Exemplo: `tratamentos.header.title` para `texts.header.title` em Tratamentos.tsx
- Arrays: `tratamentos.treatments[0].title` para primeiro item

## 📊 Workflow Recomendado

### Antes de Adicionar Novo Conteúdo

1. **Adicione o texto no JSON**:
   ```json
   // src/locales/pt-BR/Tratamentos.json
   {
     "newSection": {
       "title": "Novo Título",
       "description": "Nova descrição"
     }
   }
   ```

2. **Use no TSX com data-json-key**:
   ```tsx
   <h2 data-json-key="tratamentos.newSection.title">
     {texts.newSection.title}
   </h2>
   ```

3. **Verifique**:
   ```bash
   node scripts/verify-ids.js --page=Tratamentos
   ```

### Após Modificações

```bash
# 1. Verificar se tudo está mapeado
node scripts/verify-ids.js

# 2. Se houver problemas, corrigir
node scripts/assign-ids-final.js

# 3. Build e deploy
pnpm build
git add .
git commit -m "fix: adicionar data-json-key em novos elementos"
git push
```

## 🚨 Troubleshooting

### "Editei o texto mas não salvou"

**Causa**: Elemento sem `data-json-key`

**Solução**:
```bash
node scripts/verify-ids.js --page=NomeDaPagina
node scripts/assign-ids-final.js --page=NomeDaPagina
pnpm build && git add . && git commit -m "fix: ids" && git push
```

### "Script não encontra todos os usos de texts"

**Causa**: Syntax diferente (texts?., spread, etc)

**Solução**: Adicionar manualmente ou ajustar o regex no script

### "IDs duplicados"

**Causa**: Mesmo ID em elementos diferentes

**Solução**: Usar IDs com índices para arrays:
```tsx
{items.map((item, idx) => (
  <div key={idx} data-json-key={`page.items[${idx}].title`}>
    {item.title}
  </div>
))}
```

## 📝 Boas Práticas

### ✅ FAZER:
- Sempre adicionar `data-json-key` em elementos editáveis
- Usar padrão consistente: `{pagina}.{caminho.no.json}`
- Verificar após adicionar novos textos
- Incluir IDs em elementos dentro de loops

### ❌ NÃO FAZER:
- Deixar textos sem `data-json-key`
- Usar IDs genéricos como `text1`, `text2`
- Criar IDs que não correspondem ao JSON
- Esquecer de verificar antes do deploy

## 🔄 Integração com Deploy

Adicione verificação automática no workflow:

```bash
# Antes do build
node scripts/verify-ids.js || exit 1
pnpm build
```

Isso garante que nenhum deploy aconteça com elementos sem IDs.

## 📈 Histórico de Mudanças

### 10/11/2025
- ✅ Todas as 8 páginas principais mapeadas
- ✅ 95+ elementos com IDs únicos
- ✅ Sistema de verificação criado
- ✅ Script de correção automática funcionando

### Próximos Passos
- [ ] Adicionar verificação no CI/CD
- [ ] Criar hook pre-commit para verificação
- [ ] Documentar padrões de IDs complexos (nested arrays, etc)
