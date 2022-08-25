import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { Experience } from '@game/Experience';
import { colorAtom } from '@stores/color';

export function Game() {
  const gameRef = useRef<HTMLDivElement | null>(null);
  const experience = useRef<Experience | null>(null);
  const [color] = useAtom(colorAtom);

  useEffect(() => {
    if (gameRef.current == null) return;
    experience.current = new Experience({
      targetElement: gameRef.current,
      state: {
        cubeColor: color as unknown as THREE.Color,
      },
    });
  }, []);

  useEffect(() => {
    if (experience.current?.world == null) return;
    experience.current.world.updateCubeColor(color as unknown as THREE.Color);
  }, [color]);
  
  return <div ref={gameRef} id="game" />;
}
