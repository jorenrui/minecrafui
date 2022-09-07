import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { Experience } from '@game/Experience';
import { loadingScreenAtom } from '@stores/loadingScreen';
import { selectedBlockAtom } from '@stores/inventory';
import { useMusic } from '@lib/hooks/useMusic';

export function Game() {
  const gameRef = useRef<HTMLDivElement | null>(null);
  const experience = useRef<Experience | null>(null);
  const selectedBlock = useAtomValue(selectedBlockAtom);
  const setLoadingScreen = useSetAtom(loadingScreenAtom);
  const audio = useMusic();

  useEffect(() => {
    if (gameRef.current == null) return;
    experience.current = new Experience({
      targetElement: gameRef.current,
      state: {
        player: {
          selectedBlock,
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
    
    experience.current.on('lock', () => {
      audio.play();
    });
  }, []);

  useEffect(() => {
    if (!experience.current) return;
    experience.current.setSelectedBlock(selectedBlock);
  }, [selectedBlock]);
  
  return <div ref={gameRef} id="game" />;
}
