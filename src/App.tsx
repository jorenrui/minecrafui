import { useAtomValue } from 'jotai';
import { Game } from '@components/Canvas';
import { ColorPicker } from '@components/ColorPicker';
import { loadingScreenAtom } from '@stores/loadingScreen';

function App() {
  const loadingScreen = useAtomValue(loadingScreenAtom);

  return (
    <main>
      {loadingScreen.show && <div>{loadingScreen.message}</div>}
      <div hidden={loadingScreen.show}>
        <ColorPicker />
        <Game />
      </div>
    </main>
  )
}

export default App
