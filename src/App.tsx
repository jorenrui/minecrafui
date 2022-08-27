import { useAtomValue } from 'jotai';
import { Game } from '@components/Canvas';
import { ColorPicker } from '@components/ColorPicker';
import { loadingScreenAtom } from '@stores/loadingScreen';
import { LoadingScreen } from '@components/screens/LoadingScreen';

function App() {
  const loadingScreen = useAtomValue(loadingScreenAtom);

  return (
    <main className="min-h-full h-full bg-slate-900">
      <LoadingScreen />
      <div hidden={loadingScreen.show}>
        <div id="stats" className="absolute top-2 left-0" />
        {/* <ColorPicker /> */}
        <Game />
      </div>
    </main>
  )
}

export default App
