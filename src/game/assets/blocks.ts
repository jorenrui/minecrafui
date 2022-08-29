
import * as CANNON from 'cannon-es';
import { IBlockTypes } from '@lib/types/blocks';


export type IBlockDefinitions = {
  [key in IBlockTypes]: {
    type: 'grass' | 'dirt' | 'stone' | 'wood' | 'leaves';
    colorFilter?: boolean;
    transparent?: boolean;
    body?: {
      type?: CANNON.BodyType;
      mass?: number;
    };
    assets: {
      default: string;
      top?: string;
      bottom?: string;
    };
  };
};

export interface IBlockAssetGroup {
  type: 'block';
  loader: 'texture';
  path: string;
  definitions: IBlockDefinitions;
}

export const BLOCKS_ASSETS: IBlockAssetGroup = {
  type: 'block',
  loader: 'texture',
  path: 'assets/textures/blocks',
  definitions: {
    grass: {
      type: 'grass',
      colorFilter: true,
      body: {
        type: CANNON.Body.STATIC,
        mass: 0,
      },
      assets: {
        default: 'grass_side.png',
        top: 'grass_top.png',
        bottom: 'dirt.png'
      }
    },
    dirt: {
      type: 'dirt',
      body: {
        type: CANNON.Body.STATIC,
        mass: 0,
      },
      assets: {
        default: 'dirt.png',
      }
    },
    cobblestone: {
      type: 'stone',
      body: {
        type: CANNON.Body.STATIC,
        mass: 0,
      },
      assets: {
        default: 'cobblestone.png',
      },
    },
    oak_log: {
      type: 'wood',
      body: {
        type: CANNON.Body.STATIC,
        mass: 0,
      },
      assets: {
        default: 'log_oak.png',
        top: 'log_oak_top.png',
        bottom: 'log_oak_top.png'
      },
    },
    leaves_oak: {
      type: 'leaves',
      body: {
        type: CANNON.Body.STATIC,
        mass: 1,
      },
      colorFilter: true,
      transparent: true,
      assets: {
        default: 'leaves_oak_opaque.png',
      },
    },
  },
};
