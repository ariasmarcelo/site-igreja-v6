# ALTERAÇÕES NO BANCO DE DADOS - Fusão Pilares da Instituição

**Data:** 2025-11-16  
**Objetivo:** Unificar "Valores e Princípios" em uma única seção chamada "Os Pilares da Instituição"

---

## 📋 O QUE FOI FEITO NO FRONTEND

### **1. Estrutura Visual Atualizada**
- ✅ Seção renomeada: "Princípios da Instituição" → "Os Pilares da Instituição"
- ✅ Novo texto introdutório explicando valores + princípios
- ✅ Badges visuais: `VALOR` (dourado) e `PRINCÍPIO` (roxo)
- ✅ Hover effect melhorado nos cards
- ✅ Mantida a seção "Princípios Herméticos" separada (imutável)

### **2. Estilos CSS Adicionados** (`quemsomos.css`)
```css
.badge-valor          /* Badge dourado para valores */
.badge-principio      /* Badge roxo para princípios */
.pilar-card-hover     /* Hover effect nos cards */
```

---

## 🗄️ MUDANÇAS NECESSÁRIAS NO BANCO DE DADOS

### **IMPORTANTE:** O campo `tipo` deve ser adicionado a cada item!

### **Tabela: `pages` ou `page_content`**

**Antes:**
```json
{
  "quemsomos": {
    "principios": {
      "title": "Princípios da Instituição",
      "subtitle": "...",
      "items": [
        {
          "title": "Espiritualidade Universal",
          "content": "..."
        },
        {
          "title": "Ciência e Razão",
          "content": "..."
        }
      ]
    }
  }
}
```

**Depois (ADICIONAR campo `tipo`):**
```json
{
  "quemsomos": {
    "principios": {
      "title": "Os Pilares da Instituição",
      "subtitle": "Nossa instituição se fundamenta em valores éticos e princípios operacionais...",
      "items": [
        {
          "title": "Espiritualidade Universal",
          "content": "...",
          "tipo": "principio"
        },
        {
          "title": "Ciência e Razão",
          "content": "...",
          "tipo": "principio"
        },
        {
          "title": "Compaixão",
          "content": "...",
          "tipo": "valor"
        },
        {
          "title": "Integridade",
          "content": "...",
          "tipo": "valor"
        }
      ]
    }
  }
}
```

---

## 📝 SCRIPT SQL PARA ATUALIZAÇÃO

### **Passo 1: Adicionar campo `tipo` aos itens existentes**

```sql
-- Supabase / PostgreSQL
-- Assumindo que page_content usa JSONB

-- Atualizar cada item adicionando o campo "tipo"
-- SUBSTITUA os índices conforme sua estrutura real

UPDATE pages
SET content = jsonb_set(
  content,
  '{quemsomos,principios,items,0,tipo}',
  '"principio"'
)
WHERE page_slug = 'quemsomos';

-- Repita para cada item:
UPDATE pages
SET content = jsonb_set(
  content,
  '{quemsomos,principios,items,1,tipo}',
  '"principio"'
)
WHERE page_slug = 'quemsomos';

-- Exemplo para um valor:
UPDATE pages
SET content = jsonb_set(
  content,
  '{quemsomos,principios,items,2,tipo}',
  '"valor"'
)
WHERE page_slug = 'quemsomos';
```

### **Passo 2: Atualizar título e subtítulo**

```sql
UPDATE pages
SET content = jsonb_set(
  jsonb_set(
    content,
    '{quemsomos,principios,title}',
    '"Os Pilares da Instituição"'
  ),
  '{quemsomos,principios,subtitle}',
  '"Nossa instituição se fundamenta em valores éticos e princípios operacionais que guiam todas as nossas ações, criando uma base sólida para nosso trabalho de transformação espiritual e desenvolvimento humano."'
)
WHERE page_slug = 'quemsomos';
```

---

## 🔄 MESCLAGEM DE DADOS: Purificação → QuemSomos

### **Opção A: Migrar valores de Purificação para QuemSomos**

Se você quer trazer os valores da página `purificacao` para `quemsomos`:

```sql
-- 1. Extrair valores de purificacao
-- 2. Inserir como novos items em quemsomos.principios.items
-- 3. Definir tipo = 'valor' para cada um

-- Exemplo conceitual (adaptar à sua estrutura):
WITH valores_purificacao AS (
  SELECT 
    content->'purificacao'->'valores'->'cards' as cards
  FROM pages
  WHERE page_slug = 'purificacao'
)
UPDATE pages
SET content = jsonb_set(
  content,
  '{quemsomos,principios,items}',
  (
    SELECT content->'quemsomos'->'principios'->'items' || 
           jsonb_build_array(
             jsonb_build_object(
               'title', cards->0->>'title',
               'content', cards->0->>'content',
               'tipo', 'valor'
             )
           )
    FROM pages, valores_purificacao
    WHERE page_slug = 'quemsomos'
  )
)
WHERE page_slug = 'quemsomos';
```

### **Opção B: Manter separado (mais simples)**

Mantenha a página `purificacao` com seus valores próprios e apenas adicione o campo `tipo` aos itens de `quemsomos`:

```sql
-- Apenas adicionar "tipo": "principio" a todos os itens existentes
-- e manter purificacao intacto
```

---

## 🎯 RECOMENDAÇÃO DE ESTRUTURA FINAL

### **QuemSomos - Os Pilares da Instituição (8-10 itens)**

```json
{
  "principios": {
    "title": "Os Pilares da Instituição",
    "subtitle": "Nossa instituição se fundamenta em valores éticos...",
    "items": [
      // VALORES (3-4 itens)
      {
        "title": "Compaixão",
        "content": "Cultivamos a empatia e o cuidado genuíno...",
        "tipo": "valor"
      },
      {
        "title": "Integridade",
        "content": "Mantemos coerência entre pensamento, palavra e ação...",
        "tipo": "valor"
      },
      {
        "title": "Respeito",
        "content": "Honramos todas as tradições espirituais...",
        "tipo": "valor"
      },
      
      // PRINCÍPIOS (5-6 itens)
      {
        "title": "Espiritualidade Universal",
        "content": "Reconhecemos a unicidade da verdade espiritual...",
        "tipo": "principio"
      },
      {
        "title": "Ciência e Razão",
        "content": "Unimos sabedoria ancestral com conhecimento científico...",
        "tipo": "principio"
      },
      {
        "title": "Transparência",
        "content": "Operamos com clareza total em nossas ações...",
        "tipo": "principio"
      },
      {
        "title": "Inclusão",
        "content": "Acolhemos todas as pessoas, independente de origem...",
        "tipo": "principio"
      },
      {
        "title": "Responsabilidade Social",
        "content": "Contribuímos ativamente para o bem comum...",
        "tipo": "principio"
      }
    ]
  }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **1. Atualizar Banco de Dados:**
- [ ] Adicionar campo `tipo` a todos os itens existentes
- [ ] Definir valores: `tipo: "principio"` ou `tipo: "valor"`
- [ ] Atualizar título: "Os Pilares da Instituição"
- [ ] Atualizar subtítulo com novo texto
- [ ] (Opcional) Migrar valores de Purificação

### **2. Testar no Frontend:**
- [ ] Verificar que badges aparecem corretamente
- [ ] Confirmar cores: VALOR (dourado), PRINCÍPIO (roxo)
- [ ] Verificar hover effect nos cards
- [ ] Testar responsividade (mobile/tablet/desktop)
- [ ] Confirmar que Princípios Herméticos não foram afetados

### **3. Fallback no Código:**
- ✅ **JÁ IMPLEMENTADO**: Se `tipo` estiver ausente, assume `"principio"` por padrão
```tsx
const tipo = item.tipo || 'principio';
```

---

## 🔍 EXEMPLO COMPLETO DE ITEM

```json
{
  "title": "Compaixão",
  "content": "Cultivamos a empatia e o cuidado genuíno com todos os seres, reconhecendo nossa interconexão fundamental e agindo com amor incondicional em todas as situações.",
  "tipo": "valor"
}
```

**Campos obrigatórios:**
- `title` (string): Nome do valor/princípio
- `content` (string): Descrição completa
- `tipo` (string): `"valor"` ou `"principio"`

---

## 📊 IMPACTO VISUAL

### **Badge VALOR:**
- Cor: Dourado (amarelo/âmbar)
- Gradiente: `#fbbf24 → #f59e0b`
- Texto: Marrom escuro `#78350f`

### **Badge PRINCÍPIO:**
- Cor: Roxo (violeta)
- Gradiente: `#8b5cf6 → #7c3aed`
- Texto: Branco lilás `#f5f3ff`

---

## 🚨 NOTAS IMPORTANTES

1. **NÃO MODIFICAR `hermeticos`**: A seção dos 7 Princípios Herméticos permanece intacta
2. **Fallback implementado**: Se não houver campo `tipo`, assume `"principio"`
3. **Ícones**: O frontend usa `PRINCIPIOS_ICONS[index % length]` para rotacionar entre ícones
4. **Ordem**: Sugestão visual é intercalar valores e princípios para equilíbrio

---

## 📞 SUPORTE

Se houver dúvidas:
1. Consulte o backup em `backups/pre-pilares-merge_2025-11-16_20-16-44/`
2. Verifique `RESTORE_INSTRUCTIONS.md` para reverter mudanças
3. Teste primeiro em ambiente de desenvolvimento

---

**FIM DA DOCUMENTAÇÃO**
