import * as THREE from 'three';
import { IThree } from '@lib/types/three';
import { World } from './World';

const DEFAULT_STATE = {
  player: {
    color: 'blue' as unknown as THREE.Color,
  },
  camera: {
    position: {
      offset: new THREE.Vector3(0, -2, 1),
    },
    rotation: {
      default: { x: 1.5, y: 0, z: 0 },
    },
  },
};

export type IState = typeof DEFAULT_STATE;

interface IProps extends IThree {
  targetElement: HTMLElement;
  state?: Partial<IState>;
}

export class Experience {
  static instance: Experience;
  targetElement?: HTMLElement;
  state: IState = DEFAULT_STATE;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer();
  world!: World;

  constructor(_options?: IProps) {
    if(Experience.instance)
      return Experience.instance
    Experience.instance = this
  
    if (!_options || (_options && _options.targetElement == null))
      throw new Error('Target element is undefined.');

    this.targetElement = _options.targetElement;
    this.state = { ...DEFAULT_STATE, ...(_options.state || {})};

    this.setCamera();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.world = new World();
    this.targetElement.appendChild(this.renderer.domElement);

    this.update();

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  setCamera() {
    const { x, y, z } = this.state.camera.rotation.default;
    this.camera.rotation.set(x, y, z);
  }

  resize() {
    const width = window.innerWidth
    const height = window.innerHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  
  renderUpdate() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.world.update();
    
    window.requestAnimationFrame(() => {
      this.update()
    })
  }
}