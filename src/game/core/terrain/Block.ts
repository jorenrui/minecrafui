import * as THREE from 'three';
import { Experience } from '@game/Experience';
import { IBlockTypes } from '@lib/types/blocks';
import { IBiomes } from '@lib/types/biomes';
import { BLOCKS_ASSETS } from '@game/assets/blocks';
import { BIOMES } from '@lib/constants/biomes';

const LAYERS = {
  Top: 2,
  Bottom: 3,
};

const dummy = new THREE.Object3D();

interface IMeshes {
  [type: string]: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[]>;
}

export class Block {
  static meshes: IMeshes = {};
  static geometry = new THREE.BoxGeometry(1, 1, 1);
  static materials: { [type: string]: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] } = {};
  static utilMaterials: { [type: string]: THREE.MeshBasicMaterial } = {};
  experience: Experience;
  scene: THREE.Scene;
  type: IBlockTypes;
  id: number;
  index: number;
  mesh: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[]>;

  constructor(blockType: IBlockTypes, biome: IBiomes = 'forest', _options: { index: number, size: number }) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.type = blockType;
    this.index = _options.index;
   
    const definition = BLOCKS_ASSETS.definitions[blockType];
    let materials: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] = Block.materials[blockType];

    if (materials == null) {
      materials = Block.getMaterial(blockType, this.experience.resource!.assets.blocks);
    }
  
    if (definition.colorFilter) {
      const color = BIOMES[biome].color.hasOwnProperty(definition.type) // @ts-ignore
        ? BIOMES[biome].color[definition.type]
        : BIOMES[biome].color.default;
  
      if (Array.isArray(materials)) {
        materials.forEach((material, index) => {
          if (index === LAYERS.Top) material.color.set(color);
        });
      } else {
        materials.color.set(color);
      }
    }

    if (blockType in Block.meshes) {
      this.mesh = Block.meshes[blockType];
      this.mesh.instanceMatrix.updateRange = {
        offset: 0,
        count: this.index + 1,
      };
      this.mesh.instanceMatrix.needsUpdate = true;
    } else {
      this.mesh = new THREE.InstancedMesh(Block.geometry, materials, _options.size);
      Block.meshes[blockType] = this.mesh;
    }

    this.id = this.mesh.id;
  }

  set(x = 0, y = 0, z = 0) {
    dummy.position.set(x, y, z);
    dummy.updateMatrix();
    this.mesh.setMatrixAt(this.index, dummy.matrix);
    this.mesh.instanceMatrix.needsUpdate = true;
  }
  
  static getMaterial(type: IBlockTypes, assets: { [name: string]: THREE.Texture }) {
    let material: THREE.MeshBasicMaterial;
    let topMaterial: THREE.MeshBasicMaterial | null = null;
    let bottomMaterial: THREE.MeshBasicMaterial | null = null;
    let materials: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[];

    const definition = BLOCKS_ASSETS.definitions[type];
    const textures = Block.getMapTexture(type, assets);

    material = definition.transparent
      ? new THREE.MeshBasicMaterial({ map: textures.default, alphaMap: textures.default, transparent: true, opacity: 1 })
      : new THREE.MeshBasicMaterial({ map: textures.default });
    Block.utilMaterials[type] = material;

    if (textures.top || textures.bottom) {
      if (textures.top && textures.topName) {
        topMaterial = Block.utilMaterials[textures.topName] as THREE.MeshBasicMaterial;

        if (!topMaterial) {
          topMaterial = new THREE.MeshBasicMaterial({ map: textures.top });
          Block.utilMaterials[textures.topName] = topMaterial;
        }
      }

      if (textures.bottom && textures.bottomName) {
        bottomMaterial = Block.utilMaterials[textures.bottomName] as THREE.MeshBasicMaterial;

        if (!bottomMaterial) {
          bottomMaterial = new THREE.MeshBasicMaterial({ map: textures.bottom });
          Block.utilMaterials[textures.bottomName] = bottomMaterial;
        }
      }

      materials = [
        material,
        material,
        topMaterial ?? material,
        bottomMaterial ?? material,
        material,
        material,
      ]
    } else {
      materials = material;
    }

    Block.materials[type] = materials;
    return materials;
  }

  static getMapTexture(type: IBlockTypes, assets: { [name: string]: THREE.Texture }) {
    const blockType = BLOCKS_ASSETS.definitions[type];
  
    const defaultTextureName = blockType.assets.default.split('.')[0];
    const defaultTexture = assets[defaultTextureName];

    if (!defaultTexture)
      throw new Error(`Error: Can\'t generate ${type} block. Asset could not be found.`);
  
    if (blockType.assets.top || blockType.assets.bottom) {
      const topTextureName = blockType.assets.top?.split('.')[0];
      const topTexture = topTextureName ? assets[topTextureName] : null;
      const bottomTextureName = blockType.assets.bottom?.split('.')[0];
      const bottomTexture = bottomTextureName ? assets[bottomTextureName] : null;

      return {
        default: defaultTexture,
        topName: topTextureName,
        top: topTexture,
        bottomName: bottomTextureName,
        bottom: bottomTexture,
      };
    }

    return { default: defaultTexture };
  }
}
