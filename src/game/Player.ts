import * as THREE from 'three';
import { Experience } from './Experience';

export interface IPlayerState {
  color?: THREE.Color;
}

const DEFAULT_STATE = {
  color: 'blue' as unknown as THREE.Color,
};

export class Player {
  experience: Experience;
  scene: THREE.Scene;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  state: IPlayerState = DEFAULT_STATE;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.state = this.experience.state.player || DEFAULT_STATE;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: this.state.color }),
    );
  
    this.mesh.rotation.x = -Math.PI * 0.25;
    this.scene.add(this.mesh);
  }

  setColor(color: string | THREE.Color) {
    this.state.color = color as unknown as THREE.Color;
    this.mesh.material.color.set(this.state.color);
    this.experience.renderUpdate();
  }

  update() {
  }
}