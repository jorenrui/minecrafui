import { cx } from 'cva';

interface IProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  name?: string;
  selected?: boolean;
  imageSrc?: string;
}
export function Slot({ name, selected, imageSrc, onClick }: IProps) {
  return (
    <button
      type="button"
      className={cx(
        'h-16 w-16 flex items-center justify-center bg-slate-900 bg-opacity-50 ring-inset ring-4',
        selected ? 'scale-110 ring-white rounded border-2 border-slate-900' : 'ring-slate-400 border border-slate-600',
      )}
      onClick={onClick}
      disabled={!name}
    >
      {name
        ? <img src={imageSrc} className="h-12 w-12 bg-no-repeat bg-cover" alt={name} />
        : <span className="sr-only">Empty Slot</span>}
    </button>
  );
}
