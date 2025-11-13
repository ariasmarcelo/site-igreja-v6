/**
 * Hook desativado - Estilos agora são gerenciados via CSS/Tailwind
 * Mantido apenas para compatibilidade de imports
 */

export function usePageStyles(_pageId: string): boolean {
  // Não faz mais nada - estilos vêm de arquivos CSS
  return true;
}

export function triggerStylesRefresh(_pageId: string): void {
  // Não faz mais nada - estilos são estáticos em CSS
}
