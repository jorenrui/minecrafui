import { BLOCKS_ASSETS, IBlockDefinitions } from './blocks';

export interface IAsset {
  type: 'block' | 'models',
  loader: 'texture' | 'cube_texture',
  path: string;
  definitions: IBlockDefinitions;
}

export const ASSETS: IAsset[] = [
  BLOCKS_ASSETS,
];
