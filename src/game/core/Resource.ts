import * as THREE from 'three';
import asyncPool from "tiny-async-pool";

import { IAsset } from '@game/assets';
import EventEmitter from '../utils/EventEmitter';
import { onlyUnique } from '@lib/helpers/array/onlyUnique';
import { IBlockTypes } from '@lib/types/blocks';
import { ICubeTextureDef } from '@game/assets/envMaps';
import { ISoundDefinitions } from '@game/assets/sounds';
import { IBlockBaseType } from '@game/assets/blocks';

const LOADER_CONCURRENCY = 5;

export type IResourceSound = {
  [key in IBlockBaseType]: {
    placed?: HTMLAudioElement[];
    removed?: HTMLAudioElement[];
    step?: HTMLAudioElement[];
  }
}

export interface IResourceAsset {
  blocks: { [name: string]: THREE.Texture };
  envMaps: { [name: string]: THREE.CubeTexture };
}

export class Resource extends EventEmitter {
  static loaders = {
    texture: new THREE.TextureLoader(),
    cubeTexture: new THREE.CubeTextureLoader(),
  };

  status = { total: 0, pending: 0, loaded: 0 };
  rawAssets: IAsset[] = [];
  sounds: IResourceSound = {
    grass: {},
    leaves: {},
    sand: {},
    stone: {},
    wood: {},
  }
  assets: IResourceAsset = {
    blocks: {},
    envMaps: {},
  };

  constructor(_assets: IAsset[]) {
    super();
    this.rawAssets = _assets;
  }

  async loadAssets() {
    const textureGroups = this.rawAssets.filter((group) => group.loader === 'texture');
    const cubeTextureGroups = this.rawAssets.filter((group) => group.loader === 'cube_texture');
    const audioGroups = this.rawAssets.filter((group) => group.loader === 'audio');

    const assets = {
      sounds: [] as string[],
      textures: [] as string[],
      cubeTextures: [] as ICubeTextureDef[]
    };
  
    this.trigger('loading', [this.status]);

    if (cubeTextureGroups.length) {
      for (const group of cubeTextureGroups) {
        if (group.type === 'env_map') {
          const path = group.path;

          group.definitions.forEach((def) => {
            assets.cubeTextures.push({
              name: def.name,
              px: path + '/' + def.name + '/' + def.px,
              nx: path + '/' + def.name + '/' + def.nx,
              py: path + '/' + def.name + '/' + def.py,
              ny: path + '/' + def.name + '/' + def.ny,
              pz: path + '/' + def.name + '/' + def.pz,
              nz: path + '/' + def.name + '/' + def.nz,
            });
          });
        }
      }
      
      this.status.total += assets.cubeTextures.length;
      if (assets.cubeTextures.length)
        await this.$loadCubeTextures(assets.cubeTextures);
    }

    if (textureGroups.length) {
      for (const group of textureGroups) {
        if (group.type === 'block') {
          const path = group.path;

          for (const definitionKey of Object.keys(group.definitions)) {
            const definition = group.definitions[definitionKey as IBlockTypes];
            assets.textures.push(path + '/' + definition.assets.default);
            if (definition.assets.top) assets.textures.push(path + '/' + definition.assets.top);
            if (definition.assets.bottom) assets.textures.push(path + '/' + definition.assets.bottom);
          }
        }
      }

      assets.textures = assets.textures.filter(onlyUnique);
      this.status.total += assets.textures.length;

      if (assets.textures.length)
        await this.$loadTextures(assets.textures);
    }
    
    if (audioGroups.length) {
      for (const group of audioGroups) {
        if (group.type === 'sound_effect') {
          const path = group.path;

          for (const key of Object.keys(group.definitions)) {
            const definitionKey = key as IBlockBaseType
            const definition = group.definitions[definitionKey];
            this.sounds[definitionKey] = {
              placed: definition.placed?.map((def) => new Audio(path + '/' + def)) || [],
              removed: definition.removed?.map((def) => new Audio(path + '/' + def)) || [],
              step: definition.step?.map((def) => new Audio(path + '/' + def)) || [],
            };
          }
        }
      }
    }

    this.trigger('loaded', [this.status]);
  }

  async $loadCubeTextures(assets: ICubeTextureDef[]) {
    const maps = [] as ({ name: string; promise: Promise<THREE.CubeTexture> })[];

    assets.forEach((asset) => {
      const promise = Resource.loaders.cubeTexture.loadAsync([
        asset.px,
        asset.nx,
        asset.py,
        asset.ny,
        asset.pz,
        asset.nz,
      ] as unknown as string);

      maps.push({ name: asset.name, promise });
      this.status.pending += 1;
    });

		for await(const _ of asyncPool(LOADER_CONCURRENCY, maps, async (cubeTexture) => {
			try {
        const curTexture = await cubeTexture.promise;
        curTexture.encoding = THREE.sRGBEncoding
        curTexture.minFilter = THREE.NearestFilter;
        curTexture.magFilter = THREE.NearestFilter;

				this.assets.envMaps[cubeTexture.name] = curTexture;
        this.status.pending -= 1;
        this.status.loaded += 1;
			} catch (ex) {
        console.error(`Failed to load cube texture asset: ${cubeTexture.name}.`);
        console.error(ex);
			}
		}));
  }

  async $loadTextures(assets: string[]) {
    const textures = [] as ({ url: string; name: string; promise: Promise<THREE.Texture> })[];

    assets.forEach((asset) => {
      const promise = Resource.loaders.texture.loadAsync(asset);
      const fileName = asset.split('/').at(-1) as string;
      const assetName = fileName.split('.')[0];
      textures.push({ url: asset, name: assetName, promise });
      this.status.pending += 1;
    });

		for await(const _ of asyncPool(LOADER_CONCURRENCY, textures, async (texture) => {
			try {
        const curTexture = await texture.promise;
        curTexture.generateMipmaps = false;
        curTexture.minFilter = THREE.NearestFilter;
        curTexture.magFilter = THREE.NearestFilter;

				this.assets.blocks[texture.name] = curTexture;
        this.status.pending -= 1;
        this.status.loaded += 1;
			} catch (ex) {
        console.error(`Failed to load texture asset: ${texture.name} at "${texture.url}".`);
        console.error(ex);
			}
		}));
  }
}