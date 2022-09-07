import { IBlockTypes } from '@lib/types/blocks';

export interface IBlock {
  type: 'grass' | 'dirt' | 'stone' | 'wood' | 'leaves';
  colorFilter?: boolean;
  transparent?: boolean;
  icon?: string;
  assets: {
    default: string;
    top?: string;
    bottom?: string;
  };
}

export type IBlockDefinitions = {
  [key in IBlockTypes]: IBlock;
};

export interface IBlockAssetGroup {
  type: 'block';
  loader: 'texture';
  path: string;
  iconPath: string;
  definitions: IBlockDefinitions;
}

export const BLOCKS_ASSETS: IBlockAssetGroup = {
  type: 'block',
  loader: 'texture',
  path: 'assets/textures/blocks',
  iconPath: 'assets/icons/blocks',
  definitions: {
    grass: {
      type: 'grass',
      colorFilter: true,
      icon: 'grass.png',
      assets: {
        default: 'grass_side.png',
        top: 'grass_top.png',
        bottom: 'dirt.png'
      }
    },
    dirt: {
      type: 'dirt',
      icon: 'dirt.png',
      assets: {
        default: 'dirt.png',
      }
    },
    cobblestone: {
      type: 'stone',
      icon: 'cobblestone.png',
      assets: {
        default: 'cobblestone.png',
      },
    },
    oak_log: {
      type: 'wood',
      icon: 'log_oak.png',
      assets: {
        default: 'log_oak.png',
        top: 'log_oak_top.png',
        bottom: 'log_oak_top.png'
      },
    },
    leaves_oak: {
      type: 'leaves',
      icon: 'leaves_oak.png',
      colorFilter: true,
      transparent: true,
      assets: {
        default: 'leaves_oak_opaque.png',
      },
    },
  },
};
