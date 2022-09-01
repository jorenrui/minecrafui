import * as THREE from 'three';
import { Experience, IState } from './Experience';
import { Player } from './core/player/Player';
import { Terrain } from './core/terrain/Terrain';

export class World {
  experience: Experience;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  state?: IState;
  terrain: Terrain;
  player: Player;

  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.renderer = this.experience.renderer;
    this.scene = this.experience.scene;
    this.terrain = new Terrain(this);
    this.player = new Player();
  }

  update() {
    this.terrain.update();
    this.player.update();
    this.renderer.render(this.scene, this.camera);
  }
}
