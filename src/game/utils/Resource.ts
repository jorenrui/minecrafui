import * as THREE from 'three';
import asyncPool from "tiny-async-pool";

import { IAsset } from '@game/assets';
import EventEmitter from './EventEmitter';
import { onlyUnique } from '@lib/helpers/array/onlyUnique';

const LOADER_CONCURRENCY = 5;

interface IResourceAsset {
  blocks: { [name: string]: THREE.Texture };
}

export class Resource extends EventEmitter {
  static loaders = {
    texture: new THREE.TextureLoader(),
  };

  status = { total: 0, pending: 0, loaded: 0 };
  rawAssets: IAsset[] = [];
  assets: IResourceAsset = {
    blocks: {},
  };

  constructor(_assets: IAsset[]) {
    super();
    this.rawAssets = _assets;
  }

  async loadAssets() {
    const textureGroups = this.rawAssets.filter((group) => group.loader === 'texture');

    if (textureGroups.length) {
      const assets = {
        textures: [] as string[],
      };

      for (const group of textureGroups) {
        if (group.type === 'block') {
          for (const definitionKey of Object.keys(group.definitions)) {
            const definition = group.definitions[definitionKey];
            const path = group.path;
            assets.textures.push(path + '/' + definition.assets.default);
            if (definition.assets.top) assets.textures.push(path + '/' + definition.assets.top);
            if (definition.assets.bottom) assets.textures.push(path + '/' + definition.assets.bottom);
          }
        } 
      }

      assets.textures = assets.textures.filter(onlyUnique);
      this.status.total = assets.textures.length;

      this.trigger('loading', [this.status]);

      if (assets.textures.length)
        await this.$loadTextures(assets.textures);
    }
  }

  async $loadTextures(assets: string[]) {
    const textures = [] as ({ url: string; name: string; promise:  Promise<THREE.Texture> })[];

    assets.forEach((asset) => {
      const promise = Resource.loaders.texture.loadAsync(asset);
      const fileName = asset.split('/').at(-1) as string;
      const assetName = fileName.split('.')[0];
      textures.push({ url: asset, name: assetName, promise });
      this.status.pending += 1;
    });

		for await(const _ of asyncPool(LOADER_CONCURRENCY, textures, async (texture) => {
			try {
				this.assets.blocks[texture.name] = await texture.promise;
        this.status.pending -= 1;
        this.status.loaded += 1;
			} catch (ex) {
        console.error(`Failed to load texture asset: ${texture.name} at "${texture.url}".`);
        console.error(ex);
			}
		}));

    this.trigger('loaded', [this.status]);
  }
}