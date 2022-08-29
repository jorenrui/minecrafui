import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { Experience, IClockState } from './Experience';

export class Physics {
  static gravity = -9.82;
  static density = 2515; // kg/m^3
  experience: Experience;
  clockState: IClockState;
  world: CANNON.World;
  ground: CANNON.Body;
  debugger: any;
  materials = {
    default: new CANNON.Material('default'),
    ground: new CANNON.Material('ground'),
    player: new CANNON.Material('player'),
  };

  constructor() {
    this.experience = new Experience();
    this.clockState = this.experience.state.clock;
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, Physics.gravity, 0),
    });
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.allowSleep = true;
    this.world.defaultMaterial = this.materials.default;

    this.ground = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
      material: this.materials.ground,
    });
    this.ground.collisionResponse = false;
    this.ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.world.addBody(this.ground);

    if (this.experience.debug)
      this.debugger = new (CannonDebugger as any)(this.experience.scene, this.world);

    this.$setContactMaterial();
  }
  
  $setContactMaterial() {
    this.world.defaultContactMaterial.contactEquationStiffness = 1e7;
    this.world.defaultContactMaterial.contactEquationRelaxation = 4;

    const playerGroundContactMaterial = new CANNON.ContactMaterial(this.materials.ground, this.materials.player, {
      friction: 0.0,
      restitution: 0.3,
    });
    this.world.addContactMaterial(playerGroundContactMaterial);
  }

  update() {
    this.debugger?.update();
  }
}
