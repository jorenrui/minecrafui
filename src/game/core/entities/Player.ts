import * as THREE from 'three';
import { PlayerCamera } from '../PlayerCamera';
import { Experience, IClockState } from '../../Experience';

const JUMP_HEIGHT = 5;

const DEFAULT_STATE = {
  color: 'blue' as unknown as THREE.Color,
  direction: new THREE.Vector3(),
  mass: 1,
  speed: 50,
  velocity: new THREE.Vector3(),
  position: {
    default: { x: 0, y: 1, z: 0 },
  },
  jumping: false,
  falling: false,
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
    this.mesh.position.y = this.state.position.default.y;
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
      } else if (evt.code === 'Space') {
        this.state.jumping = true;
        this.state.falling = false;
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
    const delta = this.clockState.deltaTime;

    this.state.velocity.x -= this.state.velocity.x * 10.0 * delta;
    this.state.velocity.z -= this.state.velocity.z * 10.0 * delta;

    if (this.mesh.position.y >= JUMP_HEIGHT) {
      this.state.falling = true;
      this.state.jumping = false;
    }

    if (this.state.jumping) {
      this.state.velocity.y += 15 * this.state.mass * delta;
    } else if (this.state.falling) {
      this.state.velocity.y -= 10 * this.state.mass * delta;
    } else {
      this.state.velocity.y = 0;
    }

    this.state.direction.z = Number(this.state.moving.forward) - Number(this.state.moving.backward);
    this.state.direction.x = Number(this.state.moving.left) - Number(this.state.moving.right);
    this.state.direction.normalize(); // this ensures consistent movements in all directions

    if (this.state.moving.forward || this.state.moving.backward) {
      this.state.velocity.z -= this.state.direction.z * this.state.speed * delta;
      this.mesh.translateZ(- this.state.velocity.z * delta);
    }

    if (this.state.moving.left || this.state.moving.right) {
      this.state.velocity.x -= this.state.direction.x * this.state.speed * delta;
      this.mesh.translateX(- this.state.velocity.x * delta);
    }

    if ((this.state.falling || this.state.jumping) && this.state.velocity.y > 0) {
      this.mesh.position.y = this.state.velocity.y;
    } else if (this.state.falling || this.mesh.position.y !== this.state.position.default.y) {
      this.mesh.position.y = this.state.position.default.y;
      this.state.jumping = false;
      this.state.falling = false
    }

    this.playerCamera.update();
  }
}