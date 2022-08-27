export interface IThree {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
}

export interface IWireframeMaterial extends THREE.Material {
  depthTest: boolean;
  opacity: number;
  transparent: boolean;
  color: {
    set: (color: number | string | THREE.Color) => void;
  };
}