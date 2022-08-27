import * as THREE from 'three';
import { Experience, IState } from './Experience';
import { Player } from './core/entities/Player';
import { Block } from './core/entities/Block';

type IObjects = {
  cube?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  blocks: {
    [position: string]: Block;
  };
};

export class World {
  experience: Experience;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  state?: IState;
  player = new Player();
  objects: IObjects = {
    blocks: {}
  };

  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.renderer = this.experience.renderer;
    this.scene = this.experience.scene;

    this.setTerrain();
  }

  setTerrain() {
    for (let x = -20; x < 20; x++) {
      for (let z = -20; z < 20; z++) {
        const block = new Block('grass');
        block.mesh.position.set(x, 0, z);
        this.objects.blocks[`${x}-0-${z}`] = block;
      }
    }
  }

  update() {
    this.player.update();
    this.renderer.render(this.scene, this.camera);
  }
}
