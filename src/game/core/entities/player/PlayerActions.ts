import { Experience, IClockState } from '@game/Experience';
import { PlayerCamera } from './PlayerCamera';
import { IPlayerState } from '../Player';
import { PlayerSelector } from './PlayerSelector';

const JUMP_HEIGHT = 5;

export class PlayerActions {
  experience!: Experience;
  state!: IPlayerState;
  clockState!: IClockState;
  mesh!: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  playerCamera!: PlayerCamera;
  selector!: PlayerSelector;

  $setControls() {
    document.addEventListener('pointerdown', (evt) => {
      if (!this.playerCamera.controls.isLocked || !this.experience.world) return;
      const { x, y, z } = this.selector.position;

      if (evt.button === 0) {
        this.experience.world.terrain.placeBlock('grass', x, y, z);
        this.selector.reset();
      } else if (evt.button === 2) {
        this.experience.world.terrain.removeBlock(x, y - 1, z);
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
      this.state.velocity.z -= this.state.direction.z * this.state.speed * delta;
      this.mesh.translateZ(- this.state.velocity.z * delta);
    }

    if (this.state.moving.left || this.state.moving.right) {
      this.state.velocity.x -= this.state.direction.x * this.state.speed * delta;
      this.mesh.translateX(- this.state.velocity.x * delta);
    }

    if ((this.state.falling || this.state.jumping) && this.state.velocity.y > 0) {
      this.mesh.position.y = this.state.velocity.y;
    } else if (this.state.falling || this.mesh.position.y !== this.state.position.default.y) {
      this.mesh.position.y = this.state.position.default.y;
      this.state.jumping = false;
      this.state.falling = false
    }
  }
}