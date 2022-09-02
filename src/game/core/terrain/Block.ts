import { IBlockTypes } from '@lib/types/blocks';
import { BlockType } from './BlockType';

export class Block {
  type: IBlockTypes;
  index: number;
  x: number;
  y: number;
  z: number;
  removed = false;
  placed = true;
  blockType: BlockType;

  constructor(blockType: BlockType, index: number, x = 0, y = 0, z = 0) {
    this.type = blockType.name;
    this.index = index;
    this.x = x;
    this.y = y;
    this.z = z;
    this.blockType = blockType;
  }
}
