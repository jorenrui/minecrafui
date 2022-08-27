import * as THREE from 'three';

import { Experience } from '@game/Experience';
import { BLOCKS_ASSETS } from '@game/assets/blocks';
import { IBiomes } from '@lib/types/biomes';
import { IBlockTypes } from '@lib/types/blocks';
import { BIOMES } from '@lib/constants/biomes';

export class Block {
  static geometry = new THREE.BoxGeometry(1, 1, 1);
  static materials: { [type: string]: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] } = {};
  static utilMaterials: { [type: string]: THREE.MeshBasicMaterial } = {};

  experience: Experience;
  scene: THREE.Scene;
  mesh?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[]>;

  constructor(type: IBlockTypes, biome: IBiomes = 'forest') {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    let materials: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] = Block.materials[type];

    if (materials == null) {
      materials = Block.getMaterial(type, this.experience.resource!.assets.blocks);
    }

    if (type === 'grass') {
      if (Array.isArray(materials)) {
        materials.forEach((material, index) => {
          // Set only the top color
          if (index === 3) material.color.set(BIOMES[biome].color);
        });
      } else {
        materials.color.set(BIOMES[biome].color);
      }
    }

    this.mesh = new THREE.Mesh(Block.geometry, materials);
  }

  static getMaterial(type: IBlockTypes, assets: { [name: string]: THREE.Texture }) {
    let material: THREE.MeshBasicMaterial;
    let topMaterial: THREE.MeshBasicMaterial | null = null;
    let bottomMaterial: THREE.MeshBasicMaterial | null = null;
    let materials: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[];

    const textures = Block.getMapTexture(type, assets);

    material = new THREE.MeshBasicMaterial({ map: textures.default });
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
      const bottomTextureName = blockType.assets.top?.split('.')[0];
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
