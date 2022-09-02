import { BLOCKS_ASSETS, IBlockAssetGroup } from './blocks';
import { ENVIRONMENT_MAPS, IEnvMapAssetGroup } from './envMaps';

export const ASSETS = [
  BLOCKS_ASSETS,
  ENVIRONMENT_MAPS,
];

export type IAsset = (IBlockAssetGroup | IEnvMapAssetGroup);