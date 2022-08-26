import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { Experience } from '@game/Experience';

const DEFAULT_STATE = {
  position: {
    offset: new THREE.Vector3(0, 1, 2),
  },
  rotation: {
    default: { x: 0, y: 0, z: 0 },
  },
};

export class PlayerCamera {
  experience: Experience;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: PointerLockControls;
  state = DEFAULT_STATE;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.controls = new PointerLockControls(this.camera, document.body);

    const { x, y, z } = this.state.rotation.default;
    this.camera.rotation.set(x, y, z);

    this.setControls();
  }

  setControls() {
    document.addEventListener('click', () => {
      this.controls.lock();
    });
  }

  update() {
    if (!this.experience.world) return;

    const player = this.experience.world.player.mesh;

    // Follow player position
    const playerPosition = new THREE.Vector3();
    player.getWorldPosition(playerPosition);
    this.camera.position.copy(playerPosition).add(this.state.position.offset);

    player.rotation.y = this.camera.rotation.y;
  }
}
