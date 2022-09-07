import { useAtom, useAtomValue } from 'jotai';
import { bagAtom, selectedBlockAtom } from '@stores/inventory';
import { BLOCKS_ASSETS } from '@game/assets/blocks';
import { IBlockTypes } from '@lib/types/blocks';
import { BLOCK_TYPE } from '@lib/constants/blocks';
import { Slot } from './Slot';

const MAX_SLOTS = 9;

export function Bag() {
  const bag = useAtomValue(bagAtom);
  const [selectedBlock, setSelectedBlock] = useAtom(selectedBlockAtom);

  const handleSelectBlock = (blockType: BLOCK_TYPE) => {
    setSelectedBlock(blockType);
  };

  return (
    <div>
      <div className="hidden md:flex items-center justify-center rounded border-2 border-slate-900">
        {bag.map((blockType) => {
          const block = BLOCKS_ASSETS.definitions[blockType as IBlockTypes];
          return (
            <Slot
              key={blockType}
              name={blockType}
              selected={blockType === selectedBlock}
              imageSrc={BLOCKS_ASSETS.iconPath
                ? BLOCKS_ASSETS.iconPath + '/' + block.icon
                : BLOCKS_ASSETS.path + '/' + block.assets.default}
              onClick={() => handleSelectBlock(blockType as BLOCK_TYPE)}
            />
          );
        })}
        {(new Array(MAX_SLOTS - Object.keys(BLOCKS_ASSETS.definitions).length).fill(0).map((_, index) => (
          <Slot key={index} />
        )))}
      </div>
      <div className="block md:hidden rounded border-2 border-slate-900">
        <Slot name={selectedBlock} imageSrc={BLOCKS_ASSETS.path + '/' + BLOCKS_ASSETS.definitions[selectedBlock].assets.default} />
      </div>
    </div>    
  );
}
