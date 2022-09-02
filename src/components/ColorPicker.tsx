import { useAtom } from 'jotai';
import { colorAtom } from '@stores/color';

export function ColorPicker() {
  const [color, setColor] = useAtom(colorAtom);

  const getRandomColor = () => setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);

  return (
    <div style={{ backgroundColor: color }}>
      <button onClick={getRandomColor}>
        Color: {color}
      </button>
    </div> 
  );
}
