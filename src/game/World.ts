import * as THREE from 'three';
import { Experience, IState } from './Experience';
import { Player } from './core/entities/Player';
import { Terrain } from './core/entities/Terrain';

export class World {
  experience: Experience;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  state?: IState;
  terrain: Terrain;
  player = new Player();

  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.renderer = this.experience.renderer;
    this.scene = this.experience.scene;
    this.terrain = new Terrain(this);
  }

  update() {
    const delta = this.experience.state.clock.deltaTime;

    if (this.player.playerCamera.controls.isLocked)
      this.experience.physics?.world.step(1 / 60, delta, 3);

    this.player.update();
    this.renderer.render(this.scene, this.camera);
  }
}
