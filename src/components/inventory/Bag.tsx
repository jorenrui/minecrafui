import { Slot } from './Slot';

export function Bag() {
  return (
    <div>
      <div className="hidden md:flex items-center rounded border-2 border-slate-900">
        {[1,2,3,4,5,6,7,8,9].map((id) => (
          <Slot key={id} />
        ))}
      </div>
      <div className="block md:hidden rounded border-2 border-slate-900">
        <Slot />
      </div>
    </div>    
  );
}
