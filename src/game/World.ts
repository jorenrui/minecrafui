import * as THREE from 'three';
import { Experience, IState } from './Experience';

type IObjects = {
  cube?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
};

export class World {
  experience: Experience;
  camera: any;
  renderer: any;
  scene: any;
  state: IState;
  objects: IObjects = {};

  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.renderer = this.experience.renderer;
    this.scene = this.experience.scene;
    this.state = this.experience.state;

    this.setCube();
  }

  setCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: this.state.cubeColor || 'white' });
    this.objects.cube = new THREE.Mesh(geometry, material);

    this.scene.add(this.objects.cube);
  }
  
  updateCubeColor(color: THREE.Color) {
    if (!this.objects.cube) return;
    this.state.cubeColor = color;
    this.objects.cube.material.color.set(this.state.cubeColor);
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    if (this.objects.cube) {
      this.objects.cube.rotation.x += 0.01;
      this.objects.cube.rotation.y += 0.01;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}
