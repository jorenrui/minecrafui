import { useEffect, useState } from 'react';

export function useMusic() {
  const [audio] = useState(new Audio('assets/music/calm1.ogg'));

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.5;
  }, []);

  return audio;
}