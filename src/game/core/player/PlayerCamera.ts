import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { Experience } from '@game/Experience';
import { Player } from './Player';

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
  player: Player;
  experience: Experience;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: PointerLockControls;
  state = DEFAULT_STATE;
  angle = new THREE.Vector3();

  constructor(player: Player) {
    this.player = player;
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
    this.experience.targetElement?.addEventListener('click', () => {
      this.controls.lock();
    });
    
    this.controls.addEventListener('lock', () => {
      this.experience.trigger('lock', []);
    });
  }

  update() {
    if (!this.experience.world) return;

    // Follow player position
    this.player.mesh.getWorldPosition(playerPosition);
    this.camera.position.copy(playerPosition).add(this.state.position.offset);
  }
}
