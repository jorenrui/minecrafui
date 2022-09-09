import { useAtomValue } from 'jotai';
import { HiPlus } from 'react-icons/hi';
import { loadingScreenAtom } from '@stores/loadingScreen';
import { Game } from '@components/Canvas';
import { LoadingScreen } from '@components/screens/LoadingScreen';
import { Bag } from '@components/inventory/Bag';
import { useKeyboard } from '@lib/hooks/useKeybord';

function App() {
  const loadingScreen = useAtomValue(loadingScreenAtom);

  useKeyboard();

  return (
    <main className="min-h-full h-full bg-slate-900">
      <LoadingScreen />
      <div hidden={loadingScreen.show}>
        <div id="stats" className="absolute top-2 left-0" />
        <HiPlus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-white" />
        <div className="absolute bottom-0 left-0 p-2 w-full flex items-center justify-between">
          <div aria-hidden="true" />
          <Bag />
          <div aria-hidden="true" />
        </div>
        <Game />
      </div>
    </main>
  )
}

export default App
