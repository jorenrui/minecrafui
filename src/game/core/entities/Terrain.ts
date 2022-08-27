import * as THREE from 'three';
import { World } from '@game/World';
import { Block } from './Block';
import { IBlockTypes } from '@lib/types/blocks';
import { Experience } from '@game/Experience';

type IObjects = {
  cube?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  blocks: {
    [position: string]: Block;
  };
};

export class Terrain {
  experience: Experience;
  scene: THREE.Scene;
  world: World;
  group = new THREE.Group();
  objects: IObjects = {
    blocks: {},
  };

  constructor(world: World) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = world;

    this.scene.add(this.group);
    this.init();
  }

  init() {
    for (let x = -20; x < 20; x++) {
      for (let z = -20; z < 20; z++) {
        this.placeBlock('grass', x, 0, z);
      }
    }
  }
  
  placeBlock(type: IBlockTypes, x = 0, y = 0, z = 0) {
    const existingBlock = this.objects.blocks[`${x}-${y}-${z}`];
    if (existingBlock) return;

    const block = new Block(type);
    this.group.add(block.mesh!);
    block.mesh!.position.set(x, y, z);
    this.objects.blocks[`${x}-${y}-${z}`] = block;

    return block;
  }

  removeBlock(x = 0, y = 0, z = 0) {
    const block = this.objects.blocks[`${x}-${y}-${z}`];

    if (block?.mesh) {
      this.group.remove(block.mesh);
      block.mesh = undefined;
    }

    delete this.objects.blocks[`${x}-${y}-${z}`];
  }
}