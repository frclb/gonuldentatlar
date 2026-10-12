import { useMediaQuery } from './useMediaQuery'

/**
 * Fareyle üzerine gelme destekleniyor mu?
 * Dokunmatikte katman paneli hover yerine dokunuşla açılıyor.
 */
export const useCanHover = () => useMediaQuery('(hover: hover)')
