
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Experience, IClockState } from '@game/Experience';
import { IBlockTypes } from '@lib/types/blocks';
import { PlayerCamera } from './PlayerCamera';
import { IPlayerState } from '../Player';
import { PlayerSelector } from './PlayerSelector';

const JUMP_HEIGHT = 5;
const quaternion = new THREE.Quaternion();
const velocity = new CANNON.Vec3(0, 0, 0);

export class PlayerActions {
  experience!: Experience;
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  state!: IPlayerState;
  clockState!: IClockState;
  mesh!: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  playerCamera!: PlayerCamera;
  selector!: PlayerSelector;
  raycaster = {
    bottom: new THREE.Raycaster(),
  };

  $setControls() {
    this.raycaster.bottom.far = 1;
    
    document.addEventListener('pointerdown', (evt) => {
      if (!this.playerCamera.controls.isLocked || !this.experience.world) return;
      const { x, y, z } = this.selector.position;
      const world = this.experience.world;

      if (evt.button === 0) {
        const random = ['grass', 'dirt', 'cobblestone', 'oak_log', 'leaves_oak'][Math.floor(Math.random() * 5)] as IBlockTypes;
        world.terrain.placeBlock(random, x, y, z);
        this.selector.reset();
      } else if (evt.button === 2) {
        world.terrain.removeBlock(
          x - this.selector.normal.x,
          y - this.selector.normal.y,
          z - this.selector.normal.z,
        );
      }
    });

    document.addEventListener('keydown', (evt) => {
      if (!this.playerCamera.controls.isLocked) return;
  
      if (evt.code === 'KeyW') {
        this.state.moving.forward = true;
      } else if (evt.code === 'KeyS') {
        this.state.moving.backward = true;
      } else if (evt.code === 'KeyA') {
        this.state.moving.left = true;
      } else if (evt.code === 'KeyD') {
        this.state.moving.right = true;
      } else if (evt.code === 'Space') {
        if (!this.state.jumping) velocity.y += 5;
        this.state.jumping = true;
      }
    });
    
    document.addEventListener('keyup', (evt) => {
      if (!this.playerCamera.controls.isLocked) return;

      if (evt.code === 'KeyW') {
        this.state.moving.forward = false;
      } else if (evt.code === 'KeyS') {
        this.state.moving.backward = false;
      } else if (evt.code === 'KeyA') {
        this.state.moving.left = false;
      } else if (evt.code === 'KeyD') {
        this.state.moving.right = false;
      }
    });
  }

  $updateActions() {
    const delta = this.clockState.deltaTime;
  
    // Set rotation
    this.playerCamera.controls.getObject().getWorldQuaternion(quaternion);
    
    this.raycaster.bottom.ray.origin = this.mesh.position;
    this.raycaster.bottom.ray.direction.set(0, -1, 0);
    const intersections = this.raycaster.bottom.intersectObjects( this.experience.world?.terrain.group.children || [], false);

    // Set direction
    this.state.direction.z = Number(this.state.moving.forward) - Number(this.state.moving.backward);
    this.state.direction.x = Number(this.state.moving.left) - Number(this.state.moving.right);
    this.state.direction.normalize(); // this ensures consistent movements in all directions

    velocity.y -= 9.8 * delta;

    // Set velocity based on direction
    if (this.state.moving.forward || this.state.moving.backward) {
      this.state.velocity.z = -this.state.direction.z * this.state.speed * delta;
      velocity.z = this.state.velocity.z;
    } else {
      velocity.z = 0;
    }

    if (this.state.moving.left || this.state.moving.right) {
      this.state.velocity.x = -this.state.direction.x * this.state.speed * delta;
      velocity.x = this.state.velocity.x;
    } else {
      velocity.x = 0;
    }

    if (this.state.jumping) {
      this.mesh.position.y += velocity.y * delta;
    }

    const onObject = !!intersections[0] && this.mesh.position.y - intersections[0].object.position.y <= 1;
  
    if (onObject) {
      velocity.y = 0;
      this.mesh.position.y = intersections[0].object.position.y + 1;
      this.state.jumping = false;
    } else {
      this.mesh.position.y += velocity.y * delta;
    }
    
    this.experience.world?.terrain.worker.postMessage({
      type: 'movePlayer',
      payload: {
        position: {
          y: this.mesh.position.y,
        },
        velocity: {
          x: velocity.x,
          y: velocity.y,
          z: velocity.z,
        },
        quaternion: {
          y: quaternion.y,
          w: quaternion.w,
        },
      },
    });
  }
}