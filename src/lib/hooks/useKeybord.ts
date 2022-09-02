import { useEffect } from 'react';
import { useInventoryKeyboard } from './inventory/useInventoryKeyboard';

export function useKeyboard() {
  const setInventory = useInventoryKeyboard();
  const handleKeydown = (evt: KeyboardEvent) => {
    setInventory(evt.code);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    }
  }, []);
}