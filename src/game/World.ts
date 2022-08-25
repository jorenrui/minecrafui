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
      color: 0x964B00,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI * 0.25;
    this.scene.add(plane);
  }

  setPlayer() {
    this.player = new Player();
  }
  
  updateCubeColor(color: THREE.Color) {
    if (!this.objects.cube) return;
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.player?.update();
    this.renderer.render(this.scene, this.camera);
  }
}
