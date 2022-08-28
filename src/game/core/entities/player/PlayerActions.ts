
import * as THREE from 'three';
import { Experience, IClockState } from '@game/Experience';
import { IBlockTypes } from '@lib/types/blocks';
import { PlayerCamera } from './PlayerCamera';
import { IPlayerState } from '../Player';
import { PlayerSelector } from './PlayerSelector';

const JUMP_HEIGHT = 5;

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
    front: new THREE.Raycaster(),
    back: new THREE.Raycaster(),
    left: new THREE.Raycaster(),
    right: new THREE.Raycaster(),
  };

  $setControls() {
    this.raycaster.front.far = 1;
    this.raycaster.back.far = 1;
    this.raycaster.left.far = 1;
    this.raycaster.right.far = 1;

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
      if (evt.code === 'KeyW') {
        this.state.moving.forward = true;
      } else if (evt.code === 'KeyS') {
        this.state.moving.backward = true;
      } else if (evt.code === 'KeyA') {
        this.state.moving.left = true;
      } else if (evt.code === 'KeyD') {
        this.state.moving.right = true;
      } else if (evt.code === 'Space') {
        this.state.jumping = true;
        this.state.falling = false;
      }
    });
    
    document.addEventListener('keyup', (evt) => {
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
    const terrain = this.experience.world?.terrain;
    if (!terrain) return;

    this.state.velocity.x -= this.state.velocity.x * 10.0 * delta;
    this.state.velocity.z -= this.state.velocity.z * 10.0 * delta;

    if (this.mesh.position.y >= JUMP_HEIGHT) {
      this.state.falling = true;
      this.state.jumping = false;
    }

    if (this.state.jumping) {
      this.state.velocity.y += 15 * this.state.mass * delta;
    } else if (this.state.falling) {
      this.state.velocity.y -= 10 * this.state.mass * delta;
    } else {
      this.state.velocity.y = 0;
    }

    this.state.direction.z = Number(this.state.moving.forward) - Number(this.state.moving.backward);
    this.state.direction.x = Number(this.state.moving.left) - Number(this.state.moving.right);
    this.state.direction.normalize(); // this ensures consistent movements in all directions

    if (this.state.moving.forward || this.state.moving.backward) {
      if (!this.$collideCheck('z', this.state.direction.z)) {
        this.state.velocity.z -= this.state.direction.z * this.state.speed * delta;
        this.mesh.translateZ(- this.state.velocity.z * delta);
      }
    }

    if (this.state.moving.left || this.state.moving.right) {
      if (!this.$collideCheck('x', this.state.direction.x)) {
        this.state.velocity.x -= this.state.direction.x * this.state.speed * delta;
        this.mesh.translateX(- this.state.velocity.x * delta);
      }
    }

    if ((this.state.falling || this.state.jumping) && this.state.velocity.y > 0) {
      this.mesh.position.y = this.state.velocity.y;
    } else if (this.state.falling || this.mesh.position.y !== this.state.position.default.y) {
      this.mesh.position.y = this.state.position.default.y;
      this.state.jumping = false;
      this.state.falling = false
    }
  }

  $collideCheck(axis: string, direction: number) {
    let intersects = [];
    const position = this.mesh.position;

    if (axis === 'z') {
      if (direction > 0) {
        this.raycaster.front.setFromCamera(this.selector.pointer, this.camera);
        this.raycaster.front.ray.origin.y = this.mesh.position.y;
        intersects = this.raycaster.front.intersectObjects(this.experience.world?.terrain.group.children || [], false);
      } else {
        this.raycaster.back.ray.origin = position;
        this.raycaster.back.ray.direction.set(0, 0, 1);
        intersects = this.raycaster.back.intersectObjects(this.experience.world?.terrain.group.children || [], false);
      }
    } else if (axis === 'x') {
      if (direction > 0) {
        this.raycaster.left.ray.origin = position;
        this.raycaster.left.ray.direction.set(-1, 0, 0);
        intersects = this.raycaster.left.intersectObjects(this.experience.world?.terrain.group.children || [], false);
      } else {
        this.raycaster.right.ray.origin = position;
        this.raycaster.right.ray.direction.set(1, 0, 0);
        intersects = this.raycaster.right.intersectObjects(this.experience.world?.terrain.group.children || [], false);
      }
    }

    return !!intersects.length;
  }
}