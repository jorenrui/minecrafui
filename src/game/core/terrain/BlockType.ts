import * as THREE from 'three';
import { IBlockTypes } from '@lib/types/blocks';
import { BLOCKS_ASSETS, IBlock, IBlockBaseType } from '@game/assets/blocks';
import { Material } from '../Material';
import { Block } from './Block';

const dummy = new THREE.Object3D();

export class BlockType {
  static geometry = new THREE.BoxGeometry(1, 1, 1);
  static maxCount = 530;
  static blocks: { [id: string]: Block } = {};
  name: IBlockTypes;
  def: IBlock;
  mesh: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[]>;
  count = 0;

  constructor(blockType: IBlockTypes) {
    this.mesh = new THREE.InstancedMesh(
      BlockType.geometry,
      Material.get(blockType),
      BlockType.maxCount,
    );
    this.name = blockType;
    this.mesh.name = blockType;
    this.def = BLOCKS_ASSETS.definitions[blockType];
  }

  set(index: null | number = 0, x = 0, y = 0, z = 0) {
    if (BlockType.blocks[`${x}_${y}_${z}`]) return;

    let curIndex = index != null ? index : this.count;

    dummy.scale.setScalar(1);
    dummy.position.set(x, y, z);
    dummy.updateMatrix();
    this.mesh.setMatrixAt(curIndex, dummy.matrix);
  
    const block = new Block(this, curIndex, x, y, z);
    BlockType.blocks[`${x}_${y}_${z}`] = block;
    this.mesh.instanceMatrix.count = this.count;
    this.needsUpdate();

    this.count += 1;
    return block;
  }

  remove(x = 0, y = 0, z = 0) {
    const block = BlockType.blocks[`${x}_${y}_${z}`];
    if (!block) return;
    delete BlockType.blocks[`${x}_${y}_${z}`];
  
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    this.mesh.setMatrixAt(block.index, dummy.matrix);
    this.needsUpdate();
  }

  needsUpdate() {
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  forceUpdate() {
    this.mesh.updateMatrix();
  }
}