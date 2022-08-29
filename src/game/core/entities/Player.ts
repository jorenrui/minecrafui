import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { PlayerCamera } from './player/PlayerCamera';
import { Experience, IClockState } from '../../Experience';
import { PlayerActions } from './player/PlayerActions';
import { PlayerSelector } from './player/PlayerSelector';
import { Physics } from '@game/Physics';

const DEFAULT_STATE = {
  color: 'blue' as unknown as THREE.Color,
  direction: new THREE.Vector3(),
  mass: 100,
  speed: 500,
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
  body: CANNON.Body;
  state: IPlayerState = DEFAULT_STATE;
  playerCamera = new PlayerCamera(this);
  selector = new PlayerSelector();
  physics?: Physics;

  constructor() {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.clockState = this.experience.state.clock;
    this.physics = this.experience.physics;

    this.state = { ...DEFAULT_STATE, ...(this.experience.state.player || {})};
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: this.state.color }),
    );
    this.mesh.position.y = this.state.position.default.y;

    const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    this.body = new CANNON.Body({
      mass: Physics.density * shape.volume(),
      position: new CANNON.Vec3(0, this.state.position.default.y, 0),
      shape,
    });
    this.body.angularDamping = 1;
    this.physics?.world.addBody(this.body);
    
    if (!this.experience.debug)
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