import * as THREE from 'three';
import { BLOCKS_ASSETS } from '@game/assets/blocks';
import { IBlockTypes } from '@lib/types/blocks';
import { IResourceAsset, Resource } from './Resource';
import { BIOMES } from '@lib/constants/biomes';

const LAYERS = {
  Top: 2,
  Bottom: 3,
};

export class Material {
  static blocks: { [type: string]: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] } = {};
  static utilBlocks: { [type: string]: THREE.MeshBasicMaterial } = {};
  assets: IResourceAsset;

  constructor(resource: Resource) {
    this.assets = resource.assets;
    this.initBlockMaterials();
  }

  initBlockMaterials() {
    const biome = 'forest';

    for (const key of Object.keys(BLOCKS_ASSETS.definitions)) {
      const blockType = key as IBlockTypes;
      const material = Material.blocks[blockType];
      const definition = BLOCKS_ASSETS.definitions[blockType];
  
      if (material == null) {
        const materials = Material.blocks[blockType] = Material.getTexture(blockType, this.assets.blocks);
        
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
      }
    }
  }
  
  static get(type: IBlockTypes) {
    return Material.blocks[type];
  }

  static getTexture(type: IBlockTypes, assets: { [name: string]: THREE.Texture }) {
    let material: THREE.MeshBasicMaterial;
    let topMaterial: THREE.MeshBasicMaterial | null = null;
    let bottomMaterial: THREE.MeshBasicMaterial | null = null;
    let materials: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[];

    const definition = BLOCKS_ASSETS.definitions[type];
    const textures = Material.getMapTexture(type, assets);

    material = definition.transparent
      ? new THREE.MeshBasicMaterial({ map: textures.default, alphaMap: textures.default, transparent: true, opacity: 1 })
      : new THREE.MeshBasicMaterial({ map: textures.default });
    Material.utilBlocks[type] = material;

    if (textures.top || textures.bottom) {
      if (textures.top && textures.topName) {
        topMaterial = Material.utilBlocks[textures.topName] as THREE.MeshBasicMaterial;

        if (!topMaterial) {
          topMaterial = new THREE.MeshBasicMaterial({ map: textures.top });
          Material.utilBlocks[textures.topName] = topMaterial;
        }
      }

      if (textures.bottom && textures.bottomName) {
        bottomMaterial = Material.utilBlocks[textures.bottomName] as THREE.MeshBasicMaterial;

        if (!bottomMaterial) {
          bottomMaterial = new THREE.MeshBasicMaterial({ map: textures.bottom });
          Material.utilBlocks[textures.bottomName] = bottomMaterial;
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

    Material.blocks[type] = materials;
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