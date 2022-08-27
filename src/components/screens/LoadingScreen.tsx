import { useAtomValue } from 'jotai';
import { loadingScreenAtom } from '@stores/loadingScreen';

export function LoadingScreen() {
  const loadingScreen = useAtomValue(loadingScreenAtom);

  if (!loadingScreen.show) return null;

  return (
    <div className="min-h-full bg-slate-900 flex items-center justify-center">
      <div className="text-center font-mono text-white">
        <h1 className="my-2 text-3xl font-bold">
          Loading your Gameau
        </h1>
        <p className="my-1 text-xl">
          {loadingScreen.message}
        </p>
      </div>
    </div>
  );
}
