import { useEffect, useState } from 'react';

export function useMusic() {
  const [audio] = useState(new Audio('assets/music/calm1.ogg'));

  useEffect(() => {
    audio.play();
  }, []);
}