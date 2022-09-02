import * as THREE from 'three';
import { World } from '@game/World';
import { IBlockTypes } from '@lib/types/blocks';
import { Experience } from '@game/Experience';
import { BLOCKS_ASSETS } from '@game/assets/blocks';
import { BlockType } from './BlockType';

export class Terrain {
  experience: Experience;
  scene: THREE.Scene;
  world: World;
  group = new THREE.Group();
  assets: { [name: string]: THREE.Texture; };
  blocks: BlockType[] = [];

  constructor(world: World) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.assets = this.experience.resource!.assets.blocks;
    this.world = world;

    if (!this.experience.debug)
      this.scene.add(this.group);

    this.initBlocks();
    this.init();
  }

  initBlocks() {
    for (const key of Object.keys(BLOCKS_ASSETS.definitions)) {
      const blockType = key as IBlockTypes;
      const block = new BlockType(blockType);
      this.blocks.push(block);
      this.group.add(block.mesh);
    }
  }

  init() {
    const grassBlockType = this.blocks.find((item) => item.name === 'grass');
    if (!grassBlockType) return;
    
    let index = 0;

    for (let x = -10; x < 10; x++) {
      for (let z = -10; z < 10; z++) {
        grassBlockType.set(index, x, 0, z);
        index++;
      }
    }

    grassBlockType.needsUpdate();
  }
  
  placeBlock(type: IBlockTypes, x = 0, y = 0, z = 0) {
    const blockType = this.blocks.find((item) => item.name === type);
    if (!blockType) return;
    blockType.set(null, x, y, z);
    blockType.forceUpdate();
  }

  removeBlock(x = 0, y = 0, z = 0) {
    const block = BlockType.blocks[`${x}_${y}_${z}`];
    if (!block?.placed) return;
    block.blockType.remove(x, y, z);
    block.blockType.forceUpdate();
  }

  update() {
  }
}