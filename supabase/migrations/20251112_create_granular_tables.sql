-- Migration: Estrutura granular para textos
-- Data: 2025-11-12
-- Descrição: Substitui page_contents por estrutura granular de textos

-- Tabela para entradas de texto individuais
CREATE TABLE IF NOT EXISTS text_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  json_key TEXT NOT NULL UNIQUE,  -- Ex: "purificacao.psicodelicos.title"
  content JSONB NOT NULL,          -- Ex: { "pt-BR": "texto", "en": "text" }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_text_entries_page_id ON text_entries(page_id);
CREATE INDEX IF NOT EXISTS idx_text_entries_json_key ON text_entries(json_key);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_text_entries_updated_at ON text_entries;
CREATE TRIGGER update_text_entries_updated_at
  BEFORE UPDATE ON text_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE text_entries IS 'Armazena cada texto individualmente, identificado por json_key';
COMMENT ON COLUMN text_entries.json_key IS 'Chave única do formato "pagina.secao.campo" (ex: purificacao.psicodelicos.title)';
COMMENT ON COLUMN text_entries.content IS 'Conteúdo multi-idioma em formato JSONB';
