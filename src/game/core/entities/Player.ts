import * as THREE from 'three';
import { PlayerCamera } from './player/PlayerCamera';
import { Experience, IClockState } from '../../Experience';
import { PlayerActions } from './player/PlayerActions';
import { PlayerSelector } from './player/PlayerSelector';

const DEFAULT_STATE = {
  color: 'blue' as unknown as THREE.Color,
  direction: new THREE.Vector3(),
  mass: 1,
  speed: 50,
  velocity: new THREE.Vector3(),
  position: {
    default: { x: 0, y: 1, z: 0 },
  },
  jumping: false,
  falling: false,
  moving: {
    forward: false,
    backward: false,
    left: false,
    right: false,
  },
};
export type IPlayerState = typeof DEFAULT_STATE;

export class Player extends PlayerActions {
  experience: Experience;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  clockState: IClockState;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  state: IPlayerState = DEFAULT_STATE;
  playerCamera = new PlayerCamera();
  selector = new PlayerSelector();

  constructor() {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.clockState = this.experience.state.clock;

    this.state = { ...DEFAULT_STATE, ...(this.experience.state.player || {})};
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: this.state.color }),
    );
    this.mesh.position.y = this.state.position.default.y;
    this.scene.add(this.mesh);

    this.$setControls();
  }

  setColor(color: string | THREE.Color) {
    this.state.color = color as unknown as THREE.Color;
    this.mesh.material.color.set(this.state.color);
    this.experience.renderUpdate();
  }

  update() {
    this.$updateActions();
    this.playerCamera.update();
    this.selector.update();
  }
}