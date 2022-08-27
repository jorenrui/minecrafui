import * as THREE from 'three';
import Stats from 'stats.js';

import { IThree } from '@lib/types/three';
import { World } from './World';
import { Resource } from './core/Resource';
import { ASSETS } from './assets/index';
import EventEmitter from './utils/EventEmitter';

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

export class Experience extends EventEmitter {
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
  resource?: Resource;

  constructor(_options?: IProps) {
    if(Experience.instance)
      return Experience.instance;
    super();
    Experience.instance = this;
    
    if (!_options || (_options && _options.targetElement == null))
      throw new Error('Target element is undefined.');

    this.targetElement = _options.targetElement;
    this.state = { ...DEFAULT_STATE, ...(_options.state || {})};

    this.resource = new Resource(ASSETS);
    this.setStats();
    
    this.scene.background = new THREE.Color( 0x7fa9ff );
    this.renderer.setSize(this.width, this.height);
    this.targetElement.appendChild(this.renderer.domElement);

    this.update();

    window.addEventListener('resize', () => {
      this.resize();
    });

    this.resource.loadAssets();
    this.resource.on('loading', (status: any) => {
      this.trigger('loading', [status]);
    });
    this.resource.on('loaded', (status: any) => {
      this.trigger('loaded', [status]);
      console.log(`Finished loading: ${status.loaded} out of ${status.total} assets has been loaded.`);      
      this.world = new World();
    });
  }

  setStats() {
    const element = document.getElementById('stats');
    if (!element) {
      console.error('Could not find target element for stats.');
      return;
    }

    this.stats = new Stats();
    this.stats.showPanel(0);
    element.appendChild(this.stats.dom);
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

  	this.stats.begin();
    this.world?.update();
  	this.stats.end();
    
    window.requestAnimationFrame(() => {
      this.update();
    });
  }
}