import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Event emitter global para sincronização de dados entre componentes
const refreshEvents = new Map<string, Set<() => void>>();

// Flag global para bloquear atualizações enquanto há edições pendentes
const editLocks = new Map<string, boolean>();

export const triggerRefresh = (pageId: string) => {
  const normalizedPageId = pageId.toLowerCase();
  const listeners = refreshEvents.get(normalizedPageId);
  console.log(`🔄 triggerRefresh(${pageId}) - listeners: ${listeners?.size || 0}`);
  if (listeners) {
    listeners.forEach(callback => {
      console.log(`  → Calling refresh callback for ${pageId}`);
      callback();
    });
  }
};

export const setEditLock = (pageId: string, locked: boolean) => {
  editLocks.set(pageId.toLowerCase(), locked);
  console.log(`🔒 Edit lock for ${pageId}: ${locked}`);
};

export const isEditLocked = (pageId: string): boolean => {
  return editLocks.get(pageId.toLowerCase()) || false;
};

/**
 * Hook personalizado para carregar textos EXCLUSIVAMENTE do Supabase
 * Busca dados diretamente do banco de dados PostgreSQL
 * Suporta refresh automático quando triggerRefresh() é chamado
 * 
 * @param pageId - ID da página (index, quemsomos, contato, etc)
 * @param fallbackData - Dados de fallback (opcional, para tipagem TypeScript)
 * @returns { texts, loading, error } - Dados da página, estado de loading e erro
 */
export function useLocaleTexts<T = Record<string, unknown>>(
  pageId: string,
  fallbackData?: T
): {
  texts: T | null;
  loading: boolean;
  error: string | null;
} {
  const [texts, setTexts] = useState<T | null>(fallbackData || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Registrar listener para refresh manual
    const normalizedPageId = pageId.toLowerCase();
    if (!refreshEvents.has(normalizedPageId)) {
      refreshEvents.set(normalizedPageId, new Set());
    }
    
    const callback = () => setRefreshTrigger(prev => prev + 1);
    refreshEvents.get(normalizedPageId)?.add(callback);
    
    return () => {
      refreshEvents.get(normalizedPageId)?.delete(callback);
    };
  }, [pageId]);

  useEffect(() => {
    const loadFromSupabase = async () => {
      const locked = isEditLocked(pageId);
      console.log(`🔍 useLocaleTexts.loadFromSupabase(${pageId}) - locked: ${locked}, refreshTrigger: ${refreshTrigger}`);
      
      // NÃO atualizar se há edições pendentes (lock ativo)
      if (locked) {
        console.log(`⏸️ Skipping Supabase load for ${pageId} (edit lock active)`);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`📡 Fetching from Supabase for ${pageId}...`);
        const { data, error: supabaseError } = await supabase
          .from('page_contents')
          .select('content')
          .eq('page_id', pageId.toLowerCase())
          .single();
        
        if (supabaseError) {
          const errorMsg = `Erro ao carregar conteúdo: ${supabaseError.message}`;
          console.warn(`⚠️ Supabase error for ${pageId}:`, supabaseError);
          setError(errorMsg);
          setLoading(false);
          return;
        }
        
        if (data && data.content) {
          console.log(`✅ Supabase data received for ${pageId}`);
          setTexts(data.content as T);
          setError(null);
        } else {
          const errorMsg = `Nenhum conteúdo encontrado para a página: ${pageId}`;
          console.warn(`⚠️ ${errorMsg}`);
          setError(errorMsg);
        }
      } catch (error) {
        const errorMsg = `Erro inesperado: ${error instanceof Error ? error.message : 'Desconhecido'}`;
        console.error(`❌ Error loading from Supabase for ${pageId}:`, error);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadFromSupabase();
  }, [pageId, refreshTrigger]);

  return { texts, loading, error };
}
