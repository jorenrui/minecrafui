import * as THREE from 'three';
import { Experience } from '@game/Experience';

const DEFAULT_STATE = {
  position: {
    offset: new THREE.Vector3(0, -2, 1),
  },
  rotation: {
    default: { x: 1.5, y: 0, z: 0 },
  },
};

export class PlayerCamera {
  experience: Experience;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  state = DEFAULT_STATE;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    const { x, y, z } = this.state.rotation.default;
    this.camera.rotation.set(x, y, z);
  }

  update() {
    if (!this.experience.world) return;

    const playerPosition = new THREE.Vector3();
    this.experience.world.player.mesh.getWorldPosition(playerPosition);
    this.camera.position.copy(playerPosition).add(this.state.position.offset);
  }
}
