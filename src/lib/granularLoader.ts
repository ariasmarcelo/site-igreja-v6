/**
 * Utilitário para carregamento granular de elementos individuais
 * Permite buscar um único elemento de texto do DB ou fallback
 */

import { API_BASE_URL } from '@/config/api';

/**
 * Converte pageId para PascalCase
 */
function toPascalCase(pageId: string): string {
  return pageId
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Carrega um elemento granular específico
 * Exemplo: loadGranularElement("index", "hero.title")
 * 
 * Cascata:
 * 1. Busca do Supabase
 * 2. Fallback: JSON granular local (Index.hero.title.json)
 * 
 * @param pageId - ID da página
 * @param elementPath - Caminho do elemento (ex: "hero.title", "cards[0].description")
 * @returns Valor do elemento ou null
 */
export async function loadGranularElement(
  pageId: string, 
  elementPath: string
): Promise<string | null> {
  try {
    // STEP 1: Tentar buscar do Supabase
    const response = await fetch(
      `${API_BASE_URL}/api/content/${pageId}?element=${encodeURIComponent(elementPath)}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data?.value !== undefined) {
        console.log(`✅ Loaded from DB: ${pageId}.${elementPath}`);
        return data.value;
      }
    }
    
    // STEP 2: Fallback - carregar JSON granular local
    const pageName = toPascalCase(pageId);
    const fileName = `${pageName}.${elementPath}.json`;
    
    try {
      // Importação dinâmica do JSON granular
      const module = await import(`../locales/pt-BR/${fileName}`);
      console.log(`📦 Loaded from fallback: ${fileName}`);
      return module.default;
    } catch (fallbackError) {
      console.warn(`⚠️  No fallback found: ${fileName}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error loading ${pageId}.${elementPath}:`, error);
    return null;
  }
}

/**
 * Carrega múltiplos elementos granulares em paralelo
 * 
 * @param pageId - ID da página
 * @param elementPaths - Array de caminhos de elementos
 * @returns Objeto com resultados { [path]: value }
 */
export async function loadGranularElements(
  pageId: string,
  elementPaths: string[]
): Promise<Record<string, string | null>> {
  const results = await Promise.all(
    elementPaths.map(path => 
      loadGranularElement(pageId, path).then(value => ({ path, value }))
    )
  );
  
  return results.reduce((acc, { path, value }) => {
    acc[path] = value;
    return acc;
  }, {} as Record<string, string | null>);
}

/**
 * Reconstrói objeto completo a partir de múltiplos elementos granulares
 * Exemplo: 
 *   paths = ["hero.title", "hero.subtitle", "cards[0].text"]
 *   → { hero: { title: "...", subtitle: "..." }, cards: [{ text: "..." }] }
 */
export function reconstructObjectFromPaths(
  data: Record<string, string | null>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [path, value] of Object.entries(data)) {
    if (value === null) continue;
    
    const parts = path.split('.');
    let current: Record<string, unknown> = result;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      
      // Verificar se é array: "cards[0]"
      const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
      
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        
        if (!current[arrayName]) {
          current[arrayName] = [];
        }
        
        const arr = current[arrayName] as unknown[];
        
        if (isLast) {
          arr[index] = value;
        } else {
          if (!arr[index]) {
            arr[index] = {};
          }
          current = arr[index] as Record<string, unknown>;
        }
      } else {
        if (isLast) {
          current[part] = value;
        } else {
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part] as Record<string, unknown>;
        }
      }
    }
  }
  
  return result;
}
