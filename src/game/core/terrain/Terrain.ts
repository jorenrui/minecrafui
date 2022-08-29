import * as THREE from 'three';
import { World } from '@game/World';
import { Block } from '../entities/Block';
import { IBlockTypes } from '@lib/types/blocks';
import { Experience } from '@game/Experience';
import PhysicsWorker from './workers/physics?worker';

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
  worker: Worker;

  constructor(world: World) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = world;
    this.worker = new PhysicsWorker();
    this.worker.postMessage({ type: 'init' });
    this.worker.onmessage = (msg) => {
      const type = msg.data?.type;
      if (type === 'update') {
        const player = msg.data.player;
        const positions = msg.data.positions;
        const quaternions = msg.data.quaternions;
        
        this.world.player.mesh.position.copy(player.position as unknown as THREE.Vector3);
        this.world.player.mesh.quaternion.copy(player.quaternion as unknown as THREE.Quaternion);

        for (const objectKey of Object.keys(this.objects.blocks)) {
          const block = this.objects.blocks[objectKey];
          const position = positions[block.mesh.id];

          if (position) {
            const quaternion = quaternions[block.mesh.id];
            
            position.x = Math.round(position.x);
            position.y = Math.round(position.y) === 0 ? 1 : Math.round(position.y);
            position.z = Math.round(position.z);
    
            if (block.mesh.position.x !== position.x
              || block.mesh.position.y !== position.y
              || block.mesh.position.z !== position.z) {
              delete this.objects.blocks[`${block.mesh.position.x}_${block.mesh.position.y}_${block.mesh.position.z}`];
              this.objects.blocks[`${position.x}_${position.y}_${position.z}`] = block;
            }
    
            block.mesh.position.copy(position as unknown as THREE.Vector3);
            block.mesh.quaternion.copy(quaternion as unknown as THREE.Quaternion);
          }
        }
      }
    };

    if (!this.experience.debug)
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
  
  placeBlock(type: IBlockTypes, x = 0, y = 0, z = 0, body = true) {
    const existingBlock = this.objects.blocks[`${x}_${y}_${z}`];
    if (existingBlock) return;

    const block = new Block(type);
    block.mesh.position.set(x, y, z);

    if (body) {
      block.ghost = !body;
      this.worker.postMessage({
        type: 'buildBlock',
        payload:  {
          id: block.mesh.id,
          blockType: block.type,
          x,
          y,
          z,
          ghost: !body
        },
      });
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
      
      if (!block.ghost) {
        this.worker.postMessage({
          type: 'removeBlock',
          payload:  { id: block.mesh.id },
        });
      }
      
      removed = true;
    }

    delete this.objects.blocks[`${x}_${y}_${z}`];
    return removed;
  }

  update() {
    this.worker.postMessage({
      type: 'step',
      payload: {
        locked: this.world.player.playerCamera.controls.isLocked,
        delta: this.experience.state.clock.deltaTime,
      },
    });
  }
}