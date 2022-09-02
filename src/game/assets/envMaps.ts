export interface ICubeTextureDef {
  name: string;
  px: string,
  nx: string,
  py: string;
  ny: string;
  pz: string;
  nz: string;
}

export interface IEnvMapAssetGroup {
  type: 'env_map';
  loader: 'cube_texture';
  path: string;
  definitions: ICubeTextureDef[];
}

export const ENVIRONMENT_MAPS: IEnvMapAssetGroup = {
  type: 'env_map',
  loader: 'cube_texture',
  path: 'assets/envMaps',
  definitions: [
    {
      name: 'background',
      px: 'px.png',
      nx: 'nx.png',
      py: 'py.png',
      ny: 'ny.png',
      pz: 'pz.png',
      nz: 'nz.png',
    }
  ],
};
