import * as THREE from 'three';
import { Experience } from '@game/Experience';
import { IWireframeMaterial } from '@lib/types/three';
import { BlockType } from '../terrain/BlockType';
import { Block } from '../terrain/Block';

const dummy = new THREE.Object3D();
const dummyMatrix = new THREE.Matrix4();

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

    this.raycaster.far = 6;

    const wireframe = new THREE.WireframeGeometry(BlockType.geometry);
    this.mesh = new THREE.LineSegments(wireframe);
    const material = this.mesh.material as IWireframeMaterial;
    material.depthTest = false;
    material.opacity = 0.25;
    material.transparent = true;
    material.color.set('#FFFFFF');

    this.mesh.visible = true;
    this.mesh.position.set(0, 2, 0);
    this.scene.add(this.mesh);
  }

  reset() {
    this.mesh.visible = false;
  }

  update(matrix: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>, positions: { [id: string]: Block }) {
  	this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObject(matrix);
  
    if (intersects.length === 0) {
      this.mesh.visible = false;
      return;
    }

    const instance = intersects[0];

    const normal = intersects[0].face?.normal;
    if (instance.instanceId && normal) {
      matrix.getMatrixAt(instance.instanceId, dummyMatrix);
  		dummy.position.setFromMatrixPosition(dummyMatrix);
  
      this.normal = { ...normal };

      this.position.x = dummy.position.x + this.normal.x;
      this.position.y = dummy.position.y + this.normal.y;
      this.position.z = dummy.position.z + this.normal.z;
    }
  
    const selectedBlock = positions[`${this.position.x}_${this.position.y}_${this.position.z}`];

    if (!selectedBlock?.placed) {
      this.mesh.position.set(this.position.x, this.position.y, this.position.z);
      this.mesh.visible = true;
    }
  }
}