import * as THREE from 'three';

import { PlayerCamera } from './PlayerCamera';
import { Experience, IClockState } from '../../Experience';
import { PlayerControls } from './PlayerControls';
import { PlayerSelector } from './PlayerSelector';
import { BlockType } from '../terrain/BlockType';
import { Block } from '../terrain/Block';
import { BLOCK_TYPE } from '@lib/constants/blocks';

const DEFAULT_STATE = {
  color: 'blue' as unknown as THREE.Color,
  direction: new THREE.Vector3(),
  mass: 1,
  speed: 500,
  velocity: new THREE.Vector3(),
  position: {
    default: { x: 0, y: 1, z: 0 },
  },
  jumping: false,
  moving: {
    forward: false,
    backward: false,
    left: false,
    right: false,
  },
};
export type IPlayerState = typeof DEFAULT_STATE;
const matrix = new THREE.Matrix4();

export class Player extends PlayerControls {
  experience: Experience;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  clockState: IClockState;
  playerState: { selectedBlock: BLOCK_TYPE; };
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  state: IPlayerState = DEFAULT_STATE;
  playerCamera = new PlayerCamera(this);
  selector = new PlayerSelector();

  constructor() {
    super();

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.playerState = this.experience.state.player;
    this.clockState = this.experience.state.clock;

    this.state = { ...DEFAULT_STATE, ...(this.experience.state.player || {})};
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: this.state.color }),
    );
    this.mesh.position.y = this.state.position.default.y;
      
    if (!this.experience.debug)
      // this.scene.add(this.mesh);

    this.$setControls();
  }

  setColor(color: string | THREE.Color) {
    this.state.color = color as unknown as THREE.Color;
    this.mesh.material.color.set(this.state.color);
    this.experience.renderUpdate();
  }

  update() {
    let index = 0;
    const positions: { [id: string]: Block } = {};
    const collisionMatrix = new THREE.InstancedMesh(
      BlockType.geometry,
      new THREE.MeshBasicMaterial(),
      600,
    );

    // Populate collision matrix with blocks
    for (const blockKey of Object.keys(BlockType.blocks)) {
      const block = BlockType.blocks[blockKey];
      if (block.placed) {
        positions[`${block.x}_${block.y}_${block.z}`] = block;
        matrix.setPosition(block.x, block.y, block.z);
        collisionMatrix.setMatrixAt(index++, matrix);
      }
    }

    collisionMatrix.updateMatrix();

    this.playerCamera.update();
    this.updateControls(collisionMatrix);
    this.selector.update(collisionMatrix, positions);
  }
}