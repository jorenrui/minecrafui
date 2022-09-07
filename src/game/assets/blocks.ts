import { IBlockTypes } from '@lib/types/blocks';

export type IBlockBaseType = 'grass' | 'sand' | 'stone' | 'wood' | 'leaves';

export interface IBlock {
  type: IBlockBaseType;
  colorFilter?: boolean;
  transparent?: boolean;
  icon?: string;
  sounds?: {
    placed?: string[];
    removed?: string[];
    step?: string[];
  },
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
      sounds: {
        removed: [
          'assets/sound-effects/dig/grass1.ogg',
          'assets/sound-effects/dig/grass2.ogg',
          'assets/sound-effects/dig/grass3.ogg',
          'assets/sound-effects/dig/grass4.ogg',
        ],
        step: [
          'assets/sound-effects/step/grass1.ogg',
          'assets/sound-effects/step/grass2.ogg',
          'assets/sound-effects/step/grass3.ogg',
          'assets/sound-effects/step/grass4.ogg',
          'assets/sound-effects/step/grass5.ogg',
          'assets/sound-effects/step/grass6.ogg',
        ],
      },
      assets: {
        default: 'grass_side.png',
        top: 'grass_top.png',
        bottom: 'dirt.png'
      }
    },
    dirt: {
      type: 'sand',
      icon: 'dirt.png',
      sounds: {
        removed: [
          'assets/sound-effects/dig/sand1.ogg',
          'assets/sound-effects/dig/sand2.ogg',
          'assets/sound-effects/dig/sand3.ogg',
          'assets/sound-effects/dig/sand4.ogg',
        ],
        step: [
          'assets/sound-effects/step/sand1.ogg',
          'assets/sound-effects/step/sand2.ogg',
          'assets/sound-effects/step/sand3.ogg',
          'assets/sound-effects/step/sand4.ogg',
          'assets/sound-effects/step/sand5.ogg',
        ],
      },
      assets: {
        default: 'dirt.png',
      }
    },
    cobblestone: {
      type: 'stone',
      icon: 'cobblestone.png',
      sounds: {
        removed: [
          'assets/sound-effects/dig/stone1.ogg',
          'assets/sound-effects/dig/stone2.ogg',
          'assets/sound-effects/dig/stone3.ogg',
          'assets/sound-effects/dig/stone4.ogg',
        ],
        step: [
          'assets/sound-effects/step/stone1.ogg',
          'assets/sound-effects/step/stone2.ogg',
          'assets/sound-effects/step/stone3.ogg',
          'assets/sound-effects/step/stone4.ogg',
          'assets/sound-effects/step/stone5.ogg',
          'assets/sound-effects/step/stone6.ogg',
        ],
      },
      assets: {
        default: 'cobblestone.png',
      },
    },
    oak_log: {
      type: 'wood',
      icon: 'log_oak.png',
      sounds: {
        removed: [
          'assets/sound-effects/dig/wood1.ogg',
          'assets/sound-effects/dig/wood2.ogg',
          'assets/sound-effects/dig/wood3.ogg',
          'assets/sound-effects/dig/wood4.ogg',
        ],
        step: [
          'assets/sound-effects/step/wood1.ogg',
          'assets/sound-effects/step/wood2.ogg',
          'assets/sound-effects/step/wood3.ogg',
          'assets/sound-effects/step/wood4.ogg',
          'assets/sound-effects/step/wood5.ogg',
          'assets/sound-effects/step/wood6.ogg',
        ],
      },
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
