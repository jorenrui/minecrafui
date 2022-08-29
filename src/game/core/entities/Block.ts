import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { Experience } from '@game/Experience';
import { BLOCKS_ASSETS } from '@game/assets/blocks';
import { IBiomes } from '@lib/types/biomes';
import { IBlockTypes } from '@lib/types/blocks';
import { BIOMES } from '@lib/constants/biomes';
import { Physics } from '@game/Physics';

const TOP_LAYER = 3;

export class Block {
  static geometry = new THREE.BoxGeometry(1, 1, 1);
  static shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  static mass = Physics.density * this.shape.volume();
  static materials: { [type: string]: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] } = {};
  static utilMaterials: { [type: string]: THREE.MeshBasicMaterial } = {};

  experience: Experience;
  scene: THREE.Scene;
  body: CANNON.Body;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[]>;
  ghost = true;

  constructor(type: IBlockTypes, biome: IBiomes = 'forest') {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    const definition = BLOCKS_ASSETS.definitions[type];
    let materials: THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] = Block.materials[type];

    if (materials == null) {
      materials = Block.getMaterial(type, this.experience.resource!.assets.blocks);
    }

    if (definition.colorFilter) {
      const color = BIOMES[biome].color.hasOwnProperty(definition.type) // @ts-ignore
        ? BIOMES[biome].color[definition.type]
        : BIOMES[biome].color.default;
  
      if (Array.isArray(materials)) {
        materials.forEach((material, index) => {
          if (index === TOP_LAYER) material.color.set(color);
        });
      } else {
        materials.color.set(color);
      }
    }

    this.mesh = new THREE.Mesh(Block.geometry, materials);
    this.body = new CANNON.Body({
      type: definition.body?.type,
      mass: definition.body?.mass ?? Block.mass,
      shape: Block.shape,
    });
  
    this.body.angularDamping = 1;
  }

  setBody(x = 0, y = 0, z = 0) {
    this.ghost = false;
    this.body.position = new CANNON.Vec3(x, y, z);
    this.experience.physics?.world.addBody(this.body);
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
