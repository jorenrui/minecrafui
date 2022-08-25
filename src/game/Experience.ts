import * as THREE from 'three';
import { IThree } from '@lib/types/three';
import { World } from './World';

export interface IState {
  cubeColor?: THREE.Color;
};

interface IProps extends IThree {
  targetElement: HTMLElement;
  state: IState;
}

export class Experience {
  static instance: Experience;
  targetElement?: HTMLElement;
  state: IState = {};
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer();
  world?: World;

  constructor(_options?: IProps) {
    if(Experience.instance)
      return Experience.instance
    Experience.instance = this
  
    if (!_options || (_options && _options.targetElement == null))
      throw new Error('Target element is undefined.');

    this.targetElement = _options.targetElement;
    this.state = _options?.state || {};

    this.setCamera();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.setWorld();
    this.targetElement.appendChild(this.renderer.domElement);

    this.update();

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  setCamera() {
    this.camera.position.z = 5;
  }

  setWorld() {
    this.world = new World();
  }

  resize() {
    const width = window.innerWidth
    const height = window.innerHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  update() {
    this.world?.update();
    
    window.requestAnimationFrame(() => {
      this.update()
    })
  }
}