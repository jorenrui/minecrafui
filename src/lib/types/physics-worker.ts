import { IBlockTypes } from './blocks';

export enum MessageType {
  init = 'init',
  step = 'step',
  update = 'update',
  buildBlock = 'buildBlock',
  removeBlock = 'removeBlock',
  movePlayer = 'movePlayer',
}

export interface IInitEvent {
  type: MessageType.init;
  payload: {};
}

export interface IWorldStepEvent {
  type: MessageType.step;
  payload: { locked: boolean; delta: number };
}

export interface IWorldUpdateEvent {
  type: MessageType.update;
  payload: {};
}

export interface IBuildBlockEvent {
  type: MessageType.buildBlock;
  payload: {
    id: number;
    blockType: IBlockTypes;
    x: number;
    y: number;
    z: number;
    ghost?: boolean;
  }
}

export interface IRemoveBlockEvent {
  type: MessageType.removeBlock;
  payload: {
    id: number;
  }
}

export interface IMovePlayerEvent {
  type: MessageType.movePlayer;
  payload: {
    position: { y: number };
    quaternion: { y: number, w: number };
    velocity: { x: number, y: number, z: number };
  };
}

export type IMessageEvent = (IInitEvent | IWorldStepEvent | IWorldUpdateEvent | IBuildBlockEvent | IRemoveBlockEvent | IMovePlayerEvent) & {
  type: MessageType;
}
