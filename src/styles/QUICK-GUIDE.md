# Guia Rápido - Arquitetura CSS

## 🎯 Onde Adicionar Novos Estilos?

### 🎨 Estilo de um novo componente reutilizável?
→ `styles/components/nome-do-componente.css`
- Exemplo: Carrossel, modal, tooltip

### 📄 Estilo de uma página completa?
→ `styles/layouts/pages/nome-da-pagina.css`
- Exemplo: Homepage, sobre, contato

### 🔧 Classe utilitária (helper)?
→ `styles/utilities/helpers.css`
- Exemplo: `.btn-primary`, `.card-shadow`

### 🎨 Nova cor ou variável?
→ `styles/settings/design-tokens.css`
- Exemplo: `--color-brand-primary`

### 🌐 Estilo de elemento HTML base?
→ `styles/base/elements.css`
- Exemplo: `h1`, `body`, `a`

## 📊 Fluxo de Decisão

```
Novo estilo CSS?
    │
    ├─ É uma variável/cor?
    │  └─ → settings/design-tokens.css
    │
    ├─ É elemento HTML sem classe?
    │  └─ → base/elements.css
    │
    ├─ É componente reutilizável?
    │  └─ → components/nome.css
    │
    ├─ É layout de página?
    │  └─ → layouts/pages/nome.css
    │
    └─ É classe utilitária?
       └─ → utilities/helpers.css
```

## 🔄 Checklist ao Criar CSS

- [ ] Arquivo criado no diretório correto
- [ ] Importado em `styles.css` na ordem certa
- [ ] Usa variáveis CSS (`var(--gold-500)`)
- [ ] Sem estilos inline (`style={{...}}`)
- [ ] Nome de classe descritivo (BEM ou similar)
- [ ] Mobile-first (media queries)
- [ ] Testado em diferentes telas

## 🚀 Exemplo Prático

**Preciso criar estilos para um novo botão de ação:**

1. É reutilizável? **Sim** → componente ou utility
2. É muito específico? **Não** → utility
3. Adicionar em `utilities/helpers.css`:

```css
.btn-action {
  background: var(--color-gold-500);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.btn-action:hover {
  background: var(--color-gold-600);
  transform: translateY(-2px);
}
```

4. Usar no componente:
```tsx
<button className="btn-action">Clique Aqui</button>
```

## 💡 Dicas de Performance

✅ **Use classes CSS** em vez de estilos inline
✅ **Agrupe seletores comuns**
✅ **Evite seletores muito profundos** (max 3 níveis)
✅ **Prefira classes** a IDs ou elementos
✅ **Use variáveis CSS** para valores repetidos

## 🎯 Convenção de Nomes

### BEM (Block Element Modifier)
```css
.card { }                /* Block */
.card__header { }        /* Element */
.card--featured { }      /* Modifier */
```

### Utility Classes
```css
.text-center { }
.mt-4 { }
.bg-gold { }
```

### Component Classes
```css
.visual-editor-main-btn { }
.testimonial-carousel-item { }
```
