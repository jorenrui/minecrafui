import { BLOCKS_ASSETS } from '@game/assets/blocks';
import { IBlockTypes } from '@lib/types/blocks';
import * as CANNON from 'cannon-es';
import { IMessageEvent, MessageType } from '@lib/types/physics-worker';

class Physics {
  static instance: Physics;
  static gravity = -0.82;
  world = new CANNON.World({
    gravity: new CANNON.Vec3(0, Physics.gravity, 0),
  });
  materials = {
    default: new CANNON.Material('default'),
    ground: new CANNON.Material('ground'),
    player: new CANNON.Material('player'),
  };
  shapes = {
    box: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
  };
  ground: CANNON.Body;
  player: CANNON.Body;
  blocks: { [id: number]: { ghost: boolean; body: CANNON.Body } } = {};

  constructor() {
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.allowSleep = true;
    this.world.defaultMaterial = this.materials.default;
    
    this.ground = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      material: this.materials.ground,
    });
    this.ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(this.ground);
    
    this.player = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 1, 0),
      shape: this.shapes.box,
    });
    this.player.fixedRotation = true;
    this.player.angularDamping = 1;
    this.world.addBody(this.player);

    this.$setContactMaterial();
  }
  
  $setContactMaterial() {
    this.world.defaultContactMaterial.contactEquationStiffness = 1e7;
    this.world.defaultContactMaterial.contactEquationRelaxation = 4;

    const playerDefaultContactMaterial = new CANNON.ContactMaterial(this.materials.default, this.materials.player, {
      friction: 0.0,
      restitution: 0.3,
    });
    this.world.addContactMaterial(playerDefaultContactMaterial);
    const playerGroundContactMaterial = new CANNON.ContactMaterial(this.materials.ground, this.materials.player, {
      friction: 0.0,
      restitution: 0.3,
    });
    this.world.addContactMaterial(playerGroundContactMaterial);
  }

  buildBlock(id: number, type: IBlockTypes, x = 0, y = 0, z = 0, ghost = false) {
    const definition = BLOCKS_ASSETS.definitions[type];
    const body = new CANNON.Body({
      type: definition.body?.type,
      mass: definition.body?.mass ?? 1,
      shape: this.shapes.box,
    });
    body.position = new CANNON.Vec3(x, y, z);
    body.fixedRotation = true;
    body.angularDamping = 1;
    this.blocks[id] = { ghost, body };

    if (!ghost)
      this.world.addBody(this.blocks[id].body);
  }

  removeBlock(id: number) {
    const block = this.blocks[id];
    this.world.removeBody(block.body);
    delete this.blocks[id];
  }

  movePlayer(
    position: { y: number },
    quaternion: { y: number, w: number },
    velocity: { x: number, y: number, z: number },
  ) {
    this.player.quaternion.set(0, quaternion.y, 0, quaternion.w);
    this.player.quaternion.vmult(new CANNON.Vec3(velocity.x, velocity.y, velocity.z), this.player.velocity);
    this.player.position.y = position.y;
  }

  step(locked: boolean, delta: number) {
    if (locked) this.world.step(1 / 60, delta, 3);
  }

  update() {
    let positions: { [key: number]: { x: number, y: number, z: number }} = {};
    let quaternions: { [key: number]: { x: number, y: number, z: number, w: number }} = {};

    for (const blockKey of Object.keys(this.blocks)) {
      const block = this.blocks[+blockKey];
      positions[+blockKey] = {
        x: block.body.position.x,
        y: block.body.position.y,
        z: block.body.position.z,
      };
      quaternions[+blockKey] = {
        x: block.body.quaternion.x,
        y: block.body.quaternion.y,
        z: block.body.quaternion.z,
        w: block.body.quaternion.w,
      };
    }
    
    self.postMessage({
      type: MessageType.update,
      player: {
        position: this.player.position,
        quaternion: this.player.quaternion,
      },
      positions,
      quaternions,
    });
  }
}

const physics = new Physics();

onmessage = (
  msg: MessageEvent<IMessageEvent>
) => {
  const { type, payload } = msg.data;

  switch (type) {
    case MessageType.init: {
      break;
    };
    case MessageType.step: {
      physics.step(payload.locked, payload.delta);
      break;
    };
    case MessageType.update: {
      physics.update();
      break;
    };
    case MessageType.buildBlock: {
      const { id, blockType, x, y, z, ghost } = payload;
      physics.buildBlock(id, blockType, x, y, z, ghost);
      break;
    };
    case MessageType.removeBlock: {
      physics.removeBlock(payload.id);
      break;
    };
    case MessageType.movePlayer: {
      physics.movePlayer(payload.position, payload.quaternion, payload.velocity);
      break;
    };
  }
}