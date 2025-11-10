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
 * Hook personalizado para carregar textos do Supabase
 * Busca dados diretamente do banco de dados PostgreSQL
 * Suporta refresh automático quando triggerRefresh() é chamado
 * 
 * @param pageId - ID da página (index, quemsomos, contato, etc)
 * @param defaultTexts - Conteúdo JSON padrão como fallback
 * @returns Textos da página (sempre atualizados do DB)
 */
export function useLocaleTexts<T = Record<string, unknown>>(pageId: string, defaultTexts: T): T {
  // Sempre usar defaultTexts como estado inicial
  const [texts, setTexts] = useState<T>(defaultTexts);
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
      
      try {
        console.log(`📡 Fetching from Supabase for ${pageId}...`);
        const { data, error } = await supabase
          .from('page_contents')
          .select('content')
          .eq('page_id', pageId.toLowerCase())
          .single();
        
        if (error) {
          console.warn(`⚠️ Supabase error for ${pageId}:`, error);
          console.log(`📄 Using default texts for ${pageId}`);
          return;
        }
        
        if (data && data.content) {
          console.log(`✅ Supabase data received for ${pageId}:`, data.content);
          setTexts(data.content as T);
          console.log(`✅ State updated for ${pageId}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error loading from Supabase for ${pageId}:`, error);
        // Manter defaultTexts em caso de erro
      }
    };

    loadFromSupabase();
  }, [pageId, refreshTrigger]);

  return texts;
}
