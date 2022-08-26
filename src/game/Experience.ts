import * as THREE from 'three';
import { IThree } from '@lib/types/three';
import { World } from './World';

export interface IClockState {
  deltaTime: number;
  previousTime: number;
}

const DEFAULT_STATE = {
  player: {
    color: 'blue' as unknown as THREE.Color,
  },
  clock: {
    deltaTime: 0,
    previousTime: 0,
  } as IClockState,
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
  width =  window.innerWidth;
  height = window.innerHeight;
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  world?: World;

  constructor(_options?: IProps) {
    if(Experience.instance)
      return Experience.instance
    Experience.instance = this
  
    if (!_options || (_options && _options.targetElement == null))
      throw new Error('Target element is undefined.');

    this.targetElement = _options.targetElement;
    this.state = { ...DEFAULT_STATE, ...(_options.state || {})};

    this.renderer.setSize(this.width, this.height);

    this.world = new World();
    this.targetElement.appendChild(this.renderer.domElement);

    this.update();

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  resize() {
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  
  renderUpdate() {
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    // Set time
    const elapsedTime = this.clock.getElapsedTime();
    this.state.clock.deltaTime = elapsedTime - this.state.clock.previousTime;
    this.state.clock.previousTime = elapsedTime;

    this.world?.update();
    
    window.requestAnimationFrame(() => {
      this.update();
    });
  }
}