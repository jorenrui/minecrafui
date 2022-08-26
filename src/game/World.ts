import * as THREE from 'three';
import { Experience, IState } from './Experience';
import { Player } from './Player';

type IObjects = {
  cube?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
};

export class World {
  experience: Experience;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  state?: IState;
  objects: IObjects = {};
  player?: Player;

  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.renderer = this.experience.renderer;
    this.scene = this.experience.scene;

    this.setFloor();
    this.setPlayer();
  }

  setFloor() {
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshBasicMaterial({
      color: 0xFED7AA,
    });
    const plane = new THREE.Mesh(geometry, material);
    this.scene.add(plane);
  }

  setPlayer() {
    this.player = new Player();
  }

  update() {
    this.player?.update();
    this.renderer.render(this.scene, this.camera);
  }
}
