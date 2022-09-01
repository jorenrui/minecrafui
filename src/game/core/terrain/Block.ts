import { IBlockTypes } from '@lib/types/blocks';

export class Block {
  type: IBlockTypes;
  index: number;
  x: number;
  y: number;
  z: number;
  removed = false;
  placed = true;

  constructor(blockType: IBlockTypes, index: number, x = 0, y = 0, z = 0) {
    this.type = blockType;
    this.index = index;
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
