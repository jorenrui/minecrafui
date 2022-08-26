import * as THREE from 'three';
import { PlayerCamera } from './core/PlayerCamera';
import { Experience, IClockState } from './Experience';

const DEFAULT_STATE = {
  color: 'blue' as unknown as THREE.Color,
  speed: 5,
  moving: {
    forward: false,
    backward: false,
    left: false,
    right: false,
  },
};
export type IPlayerState = typeof DEFAULT_STATE;

export class Player {
  experience: Experience;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  clockState: IClockState;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  state: IPlayerState = DEFAULT_STATE;
  playerCamera = new PlayerCamera();

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.clockState = this.experience.state.clock;

    this.state = { ...DEFAULT_STATE, ...(this.experience.state.player || {})};
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: this.state.color }),
    );
    this.mesh.position.y = 1;
    this.scene.add(this.mesh);

    this.setControls();
  }

  setControls() {
    document.addEventListener('keydown', (evt) => {
      if (evt.code === 'KeyW') {
        this.state.moving.forward = true;
      } else if (evt.code === 'KeyS') {
        this.state.moving.backward = true;
      } else if (evt.code === 'KeyA') {
        this.state.moving.left = true;
      } else if (evt.code === 'KeyD') {
        this.state.moving.right = true;
      }
    });
    
    document.addEventListener('keyup', (evt) => {
      if (evt.code === 'KeyW') {
        this.state.moving.forward = false;
      } else if (evt.code === 'KeyS') {
        this.state.moving.backward = false;
      } else if (evt.code === 'KeyA') {
        this.state.moving.left = false;
      } else if (evt.code === 'KeyD') {
        this.state.moving.right = false;
      }
    });
  }

  setColor(color: string | THREE.Color) {
    this.state.color = color as unknown as THREE.Color;
    this.mesh.material.color.set(this.state.color);
    this.experience.renderUpdate();
  }

  update() {
    // Movement controls
    if (this.state.moving.forward) {
      this.mesh.position.z -= this.clockState.deltaTime * this.state.speed;
    } else if (this.state.moving.backward) {
      this.mesh.position.z += this.clockState.deltaTime * this.state.speed;
    } else if (this.state.moving.left) {
      this.mesh.position.x -= this.clockState.deltaTime * this.state.speed;
    } else if (this.state.moving.right) {
      this.mesh.position.x += this.clockState.deltaTime * this.state.speed;
    }

    this.playerCamera.update();
  }
}