import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { Experience } from '@game/Experience';

const DEFAULT_STATE = {
  position: {
    offset: new THREE.Vector3(0, 1, 0),
  },
  rotation: {
    default: { x: 0, y: 0, z: 0 },
  },
};

const playerPosition = new THREE.Vector3();

export class PlayerCamera {
  experience: Experience;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: PointerLockControls;
  state = DEFAULT_STATE;
  angle = new THREE.Vector3();

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
  
    this.controls = new PointerLockControls(this.camera, document.body);
    this.controls.getObject().position.copy(this.camera.position);
    this.scene.add(this.controls.getObject());

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

    // Rotation
    this.camera.getWorldDirection(this.angle);
    this.angle.y = 0;
    this.angle.add(player.position);
    player.lookAt(this.angle);

    // Follow player position
    player.getWorldPosition(playerPosition);
    this.camera.position.copy(playerPosition).add(this.state.position.offset);
  }
}
