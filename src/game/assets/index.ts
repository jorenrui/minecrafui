import { BLOCKS_ASSETS, IBlockAssetGroup } from './blocks';
import { ENVIRONMENT_MAPS, IEnvMapAssetGroup } from './envMaps';
import { ISoundAssetGroup, SOUNDS_ASSETS } from './sounds';

export const ASSETS = [
  SOUNDS_ASSETS,
  BLOCKS_ASSETS,
  ENVIRONMENT_MAPS,
];

export type IAsset = (ISoundAssetGroup | IBlockAssetGroup | IEnvMapAssetGroup);