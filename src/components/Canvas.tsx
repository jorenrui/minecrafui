import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { Experience } from '@game/Experience';
import { colorAtom } from '@stores/color';
import { loadingScreenAtom } from '@stores/loadingScreen';

export function Game() {
  const gameRef = useRef<HTMLDivElement | null>(null);
  const experience = useRef<Experience | null>(null);
  const [color] = useAtom(colorAtom);
  const setLoadingScreen = useSetAtom(loadingScreenAtom);

  useEffect(() => {
    if (gameRef.current == null) return;
    experience.current = new Experience({
      targetElement: gameRef.current,
      state: {
        player: {
          color: color as unknown as THREE.Color,
        },
      },
    });

    experience.current.on('loading', () => {
      // Prevent loading for now cause it's too fast.
      // setLoadingScreen({ show: true, message: 'Loading assets...' });
    });
    
    experience.current.on('loaded', () => {
      setLoadingScreen({ show: false, message: '' });
    });
  }, []);

  useEffect(() => {
    if (!experience.current?.world?.player) return;
    experience.current.world.player.setColor(color as unknown as THREE.Color);
  }, [color]);
  
  return <div ref={gameRef} id="game" />;
}
