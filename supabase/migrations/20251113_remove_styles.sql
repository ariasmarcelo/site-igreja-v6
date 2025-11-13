-- Migration: Remover tabelas de estilos
-- Data: 2025-11-13
-- Descrição: Remove funcionalidade de edição de estilos (desativada)

-- Remover triggers
DROP TRIGGER IF EXISTS update_style_entries_updated_at ON style_entries;

-- Remover índices
DROP INDEX IF EXISTS idx_style_entries_page_id;
DROP INDEX IF EXISTS idx_style_entries_json_key;

-- Remover tabela
DROP TABLE IF EXISTS style_entries;

-- Remover tabela antiga também (se existir)
DROP TABLE IF EXISTS page_styles;

-- Comentário de histórico
COMMENT ON DATABASE postgres IS 'Removida funcionalidade de edição de estilos em 2025-11-13';
