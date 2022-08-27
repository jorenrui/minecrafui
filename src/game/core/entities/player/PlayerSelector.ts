import { Experience } from '@game/Experience';
import { IWireframeMaterial } from '@lib/types/three';
import * as THREE from 'three';
import { Block } from '../Block';

export class PlayerSelector {
  experience: Experience;
  scene: THREE.Scene;
  mesh: THREE.LineSegments<THREE.WireframeGeometry<THREE.BoxGeometry>, THREE.Material | THREE.Material[]>;
  camera: THREE.PerspectiveCamera;
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  position = { x: 0, y: 0, z: 0 };
  normal = { x: 0, y: 0, z: 0 };

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    const wireframe = new THREE.WireframeGeometry(Block.geometry);
    this.mesh = new THREE.LineSegments(wireframe);
    const material = this.mesh.material as IWireframeMaterial;
    material.depthTest = false;
    material.opacity = 0.25;
    material.transparent = true;
    material.color.set('#FFFFFF');

    this.mesh.visible = false;
    this.scene.add(this.mesh);
  
    document.addEventListener('pointermove', (evt) => {
      this.pointer.x = (evt.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = - (evt.clientY / window.innerHeight) * 2 + 1;
    });
  }

  reset() {
    this.mesh.visible = false;
  }

  update() {
    if (!this.experience.world) return;
    const world = this.experience.world;
  	this.raycaster.setFromCamera(this.pointer, this.camera);
    
  	const intersects = this.raycaster.intersectObjects(world.terrain.group.children);
    
    if (intersects.length === 0) {
      this.mesh.visible = false;
      return;
    }

    const normal = intersects[0].face?.normal;

    const { x, y, z } = intersects[0].object.position;
    const block = world.terrain.objects.blocks[`${x}_${y}_${z}`];
    
    this.position = { x, y, z };

    if (normal) {
      this.normal = { ...normal };
      this.position.x += normal.x;
      this.position.y += normal.y;
      this.position.z += normal.z;
    }

    const selectedBlock = world.terrain.objects.blocks[`${this.position.x}_${this.position.y}_${this.position.z}`];

    if (block && !selectedBlock) {
      this.mesh.position.set(this.position.x, this.position.y, this.position.z);
      this.mesh.visible = true;
    }
  }
}