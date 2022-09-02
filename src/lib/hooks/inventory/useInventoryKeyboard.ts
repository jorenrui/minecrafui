import { useAtomValue, useSetAtom } from 'jotai';
import { bagAtom, selectedBlockAtom } from '@stores/inventory';

export function useInventoryKeyboard() {
  const setSelectedBlock = useSetAtom(selectedBlockAtom);
  const bag = useAtomValue(bagAtom);

  const setInventoryShortcuts = (code: string) => {
    let triggered = false;

    const trigger = (index: number) => {
      if (bag[index]) {
        triggered = true;
        setSelectedBlock(bag[index]);
      }
    } 

    switch (code) {
      case 'Digit1': { trigger(0); break; };
      case 'Digit2': { trigger(1); break; };
      case 'Digit3': { trigger(2); break; };
      case 'Digit4': { trigger(3); break; };
      case 'Digit5': { trigger(4); break; };
      case 'Digit6': { trigger(5); break; };
      case 'Digit7': { trigger(6); break; };
      case 'Digit8': { trigger(7); break; };
      case 'Digit9': { trigger(8); break; };
    };

    return triggered;
  };

  return setInventoryShortcuts;
}