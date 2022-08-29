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

    if (!this.experience.debug)
      this.scene.add(this.group);

    this.init();
  }

  init() {
    for (let x = -20; x < 20; x++) {
      for (let z = -20; z < 20; z++) {
        this.placeBlock('grass', x, 0, z, false);
      }
    }
  }
  
  placeBlock(type: IBlockTypes, x = 0, y = 0, z = 0, body = true) {
    const existingBlock = this.objects.blocks[`${x}_${y}_${z}`];
    if (existingBlock) return;

    const block = new Block(type);
    block.mesh.position.set(x, y, z);

    if (body) {
      block.setBody(x, y, z);
    }

    this.group.add(block.mesh);
    this.objects.blocks[`${x}_${y}_${z}`] = block;

    return block;
  }

  removeBlock(x = 0, y = 0, z = 0) {
    let removed = false;
    const block = this.objects.blocks[`${x}_${y}_${z}`];

    if (block?.mesh) {
      this.group.remove(block.mesh);
      this.experience.physics?.world.removeBody(block.body);
      removed = true;
    }

    delete this.objects.blocks[`${x}_${y}_${z}`];
    return removed;
  }

  update() {
    for (const objectKey of Object.keys(this.objects.blocks)) {
      const block = this.objects.blocks[objectKey];
      block.body.position.x = Math.round(block.body.position.x);
      block.body.position.y = Math.round(block.body.position.y) === 0 ? 1 : Math.round(block.body.position.y);
      block.body.position.z = Math.round(block.body.position.z);
      if (!block.ghost) {
        if (block.mesh.position.x !== block.body.position.x
          || block.mesh.position.y !== block.body.position.y
          || block.mesh.position.z !== block.body.position.z) {
          delete this.objects.blocks[`${block.mesh.position.x}_${block.mesh.position.y}_${block.mesh.position.z}`];
          this.objects.blocks[`${block.body.position.x}_${block.body.position.y}_${block.body.position.z}`] = block;
        }

        block.mesh.position.copy(block.body.position as unknown as THREE.Vector3);
        block.mesh.quaternion.copy(block.body.quaternion as unknown as THREE.Quaternion);
      }
    }
  }
}