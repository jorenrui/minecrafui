import * as THREE from 'three';
import { IBlockTypes } from '@lib/types/blocks';
import { Material } from '../Material';
import { Block } from './Block';

const dummy = new THREE.Object3D();

export class BlockType {
  static geometry = new THREE.BoxGeometry(1, 1, 1);
  static maxCount = 530;
  static blocks: { [id: string]: Block } = {};
  name: IBlockTypes;
  mesh: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[]>;
  count = 0;
  deletedIndices: number[] = [];

  constructor(blockType: IBlockTypes) {
    this.mesh = new THREE.InstancedMesh(
      BlockType.geometry,
      Material.get(blockType),
      BlockType.maxCount,
    );
    this.name = blockType;
    this.mesh.name = blockType;
  }

  set(index: null | number = 0, x = 0, y = 0, z = 0) {
    let curIndex = index;
    let replaced = false;

    if (curIndex == null) {
      if (this.deletedIndices.length) {
        replaced = true;
        curIndex = this.deletedIndices.shift() ?? this.count;
      } else {
        curIndex = this.count;
      }
    }

    dummy.position.set(x, y, z);
    if (replaced) dummy.scale.setScalar(1);
    dummy.updateMatrix();
    this.mesh.setMatrixAt(curIndex, dummy.matrix);
    const block = new Block(this.name, curIndex, x, y, z)
    // const block = replaced
    //   ? BlockType.blocks[`${x}_${y}_${z}`]
    //   : new Block(this.name, curIndex, x, y, z)

    BlockType.blocks[`${x}_${y}_${z}`] = block;

    this.count += 1;
    this.needsUpdate();
    return block;
  }

  remove(x = 0, y = 0, z = 0) {
    const block = BlockType.blocks[`${x}_${y}_${z}`];
    if (!block) return;
    block.placed = false;
    block.removed = true;
    dummy.position.set(0, 0, 0);
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    this.mesh.setMatrixAt(block.index, dummy.matrix);
    delete BlockType.blocks[`${x}_${y}_${z}`];
    this.deletedIndices.push(block.index);
    this.count -= 1;
    this.needsUpdate();
  }

  needsUpdate() {
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  forceUpdate() {
    this.mesh.updateMatrix();
  }
}