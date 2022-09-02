
import * as THREE from 'three';
import { Experience, IClockState } from '@game/Experience';
import { IBlockTypes } from '@lib/types/blocks';
import { BLOCK_TYPE } from '@lib/constants/blocks';
import { PlayerCamera } from './PlayerCamera';
import { IPlayerState } from './Player';
import { PlayerSelector } from './PlayerSelector';

const JUMP_HEIGHT = 5;
const quaternion = new THREE.Quaternion();
const velocity = new THREE.Vector3(0, 0, 0);

interface ICollision {
  front: THREE.Intersection<THREE.Object3D<THREE.Event>> | null;
  back: THREE.Intersection<THREE.Object3D<THREE.Event>> | null;
  right: THREE.Intersection<THREE.Object3D<THREE.Event>> | null;
  left: THREE.Intersection<THREE.Object3D<THREE.Event>> | null;
  bottom: THREE.Intersection<THREE.Object3D<THREE.Event>> | null;
}

export class PlayerControls {
  experience!: Experience;
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  state!: IPlayerState;
  clockState!: IClockState;
  mesh!: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  playerCamera!: PlayerCamera;
  selector!: PlayerSelector;
  playerState!: { selectedBlock: BLOCK_TYPE; };
  raycaster = {
    front: new THREE.Raycaster(),
    back: new THREE.Raycaster(),
    right: new THREE.Raycaster(),
    left: new THREE.Raycaster(),
    bottom: new THREE.Raycaster(),
  };
  collision: ICollision = {
    front: null,
    back: null,
    right: null,
    left: null,
    bottom: null,
  };

  $setControls() {
    this.raycaster.front.far = 1;
    this.raycaster.back.far = 1;
    this.raycaster.left.far = 1;
    this.raycaster.right.far = 1;
    this.raycaster.bottom.far = 1;
    
    document.addEventListener('pointerdown', (evt) => {
      if (!this.playerCamera.controls.isLocked || !this.experience.world) return;
      const { x, y, z } = this.selector.position;
      const world = this.experience.world;

      if (evt.button === 0) {
        world.terrain.placeBlock(this.playerState.selectedBlock, x, y, z);
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
        if (!this.state.jumping) {
          this.mesh.position.y += 0.5;
          velocity.y += JUMP_HEIGHT
        };
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

  updateControls(matrix: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>) {
    const delta = this.clockState.deltaTime;
  
    // Set rotation
    this.playerCamera.controls.getObject().getWorldQuaternion(quaternion);
    this.mesh.quaternion.set(0, quaternion.y, 0, quaternion.w);
    const vector = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion)
    let direction = Math.atan2(vector.x, vector.z)

    this.$collisionCheck(matrix);

    const rotation = Math.trunc(direction);
    let frontCollide = this.collision.front;
    let backCollide = this.collision.back;
    let leftCollide = this.collision.left;
    let rightCollide = this.collision.right;

    if (rotation === 3 || rotation === -3 || rotation === 2 || rotation == -2) { // Camera facing at -z
      frontCollide = this.collision.back;
      backCollide = this.collision.front;
    } else if (rotation === 0) { // Camera facing at z
      leftCollide = this.collision.right;
      rightCollide = this.collision.left;
    } else if (rotation === 1) { // Camera facing at x
      frontCollide = this.collision.right;
      backCollide = this.collision.left;
      leftCollide = this.collision.back;
      rightCollide = this.collision.front;
    } else if (rotation === -1) { // Camera facing at -x
      frontCollide = this.collision.left;
      backCollide = this.collision.right;
      leftCollide = this.collision.front;
      rightCollide = this.collision.back;
    }
    
    // Set direction
    this.state.direction.z = Number(this.state.moving.forward) - Number(this.state.moving.backward);
    this.state.direction.x = Number(this.state.moving.left) - Number(this.state.moving.right);
    this.state.direction.normalize(); // this ensures consistent movements in all directions

    velocity.y -= 9.8 * delta;

    // Set velocity based on direction
    if (this.state.moving.forward || this.state.moving.backward) {
      this.state.velocity.z = -this.state.direction.z * this.state.speed * delta;
      velocity.z = this.state.velocity.z;

      if ((this.state.direction.z > 0 && !frontCollide) || (this.state.direction.z < 0 && !backCollide)) {
        this.mesh.translateZ(velocity.z * delta);
      }
    } else {
      velocity.z = 0;
    }

    if (this.state.moving.left || this.state.moving.right) {
      this.state.velocity.x = -this.state.direction.x * this.state.speed * delta;
      velocity.x = this.state.velocity.x;
      
      if ((this.state.direction.x > 0 && !leftCollide) || (this.state.direction.x < 0 && !rightCollide)) {
        this.mesh.translateX(velocity.x * delta);
      }
    } else {
      velocity.x = 0;
    }

    if (this.state.jumping) {
      this.mesh.position.y += velocity.y * delta;
    }

    const onObject = this.collision.bottom && this.collision.bottom.distance <= 0.5;

    if (onObject && this.collision.bottom) {
      velocity.y = 0;
      this.mesh.position.y = Math.round(this.mesh.position.y);
      this.state.jumping = false;
    } else {
      this.mesh.position.y += velocity.y * delta;
    }
  }

  $collisionCheck(matrix: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>) {
    this.$collisionCheckSide('front', matrix);
    this.$collisionCheckSide('back', matrix);
    this.$collisionCheckSide('right', matrix);
    this.$collisionCheckSide('left', matrix);
    this.$collisionCheckSide('bottom', matrix);
  }

  $collisionCheckSide(
    side: 'front' | 'back' | 'right' | 'left' | 'bottom',
    matrix: THREE.InstancedMesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>,
  ) {
    let raycaster: THREE.Raycaster = this.raycaster.front;

    switch (side) {
      case 'front': {
        raycaster = this.raycaster.front;
        raycaster.ray.origin = this.mesh.position;
        raycaster.ray.direction.set(0, 0, 1);
        break;
      };
      case 'back': {
        raycaster = this.raycaster.back;
        raycaster.ray.origin = this.mesh.position;
        raycaster.ray.direction.set(0, 0, -1);
        break;
      };
      case 'right': {
        raycaster = this.raycaster.right;
        raycaster.ray.origin = this.mesh.position;
        raycaster.ray.direction.set(1, 0, 0);
        break;
      };
      case 'left': {
        raycaster = this.raycaster.left;
        raycaster.ray.origin = this.mesh.position;
        raycaster.ray.direction.set(-1, 0, 0);
        break;
      };
      case 'bottom': {
        raycaster = this.raycaster.bottom;
        raycaster.ray.origin = this.mesh.position;
        raycaster.ray.direction.set(0, -1, 0);
        break;
      };
    }
    
    const intersections = raycaster.intersectObject(matrix);
    
    this.collision[side] = intersections.length
      ? intersections[0]
      : null;
  }
}