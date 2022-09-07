import { IBlockBaseType } from './blocks';

export interface ISound {
  placed?: string[];
  removed?: string[];
  step?: string[];
}

export type ISoundDefinitions = {
  [key in IBlockBaseType]: ISound;
};

export interface ISoundAssetGroup {
  type: 'sound_effect';
  loader: 'audio';
  path: string;
  definitions: ISoundDefinitions;
}

export const SOUNDS_ASSETS: ISoundAssetGroup = {
  type: 'sound_effect',
  loader: 'audio',
  path: 'assets/sound-effects',
  definitions: {
    grass: {
      removed: [
        'dig/grass1.ogg',
        'dig/grass2.ogg',
        'dig/grass3.ogg',
        'dig/grass4.ogg',
      ],
      step: [
        'step/grass1.ogg',
        'step/grass2.ogg',
        'step/grass3.ogg',
        'step/grass4.ogg',
        'step/grass5.ogg',
        'step/grass6.ogg',
      ],
    },
    leaves: {
      removed: [
        'dig/grass1.ogg',
        'dig/grass2.ogg',
        'dig/grass3.ogg',
        'dig/grass4.ogg',
      ],
      step: [
        'step/grass1.ogg',
        'step/grass2.ogg',
        'step/grass3.ogg',
        'step/grass4.ogg',
        'step/grass5.ogg',
        'step/grass6.ogg',
      ],
    },
    sand: {
      removed: [
        'dig/sand1.ogg',
        'dig/sand2.ogg',
        'dig/sand3.ogg',
        'dig/sand4.ogg',
      ],
      step: [
        'step/sand1.ogg',
        'step/sand2.ogg',
        'step/sand3.ogg',
        'step/sand4.ogg',
        'step/sand5.ogg',
      ],
    },
    stone: {
      removed: [
        'dig/stone1.ogg',
        'dig/stone2.ogg',
        'dig/stone3.ogg',
        'dig/stone4.ogg',
      ],
      step: [
        'step/stone1.ogg',
        'step/stone2.ogg',
        'step/stone3.ogg',
        'step/stone4.ogg',
        'step/stone5.ogg',
        'step/stone6.ogg',
      ],
    },
    wood: {
      removed: [
        'dig/wood1.ogg',
        'dig/wood2.ogg',
        'dig/wood3.ogg',
        'dig/wood4.ogg',
      ],
      step: [
        'step/wood1.ogg',
        'step/wood2.ogg',
        'step/wood3.ogg',
        'step/wood4.ogg',
        'step/wood5.ogg',
        'step/wood6.ogg',
      ],
    },
  },
}