import { useEffect } from 'react';

import { channels } from '@/lib/color';

/**
 * The room takes the colour of whatever is currently on screen.
 * One CSS variable drives every accent surface in the site at once.
 */
export function useAccent(hex: string | undefined) {
  useEffect(() => {
    if (!hex) return;
    document.documentElement.style.setProperty('--accent', channels(hex));
  }, [hex]);
}
