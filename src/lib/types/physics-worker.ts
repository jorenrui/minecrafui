import { IBlockTypes } from './blocks';

export enum MessageType {
  init = 'init',
  step = 'step',
  update = 'update',
  buildBlock = 'buildBlock',
  removeBlock = 'removeBlock',
}

export interface IInitEvent {
  type: MessageType.init;
  payload: {};
}

export interface IWorldStepEvent {
  type: MessageType.step;
  payload: { delta: number };
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

export type IMessageEvent = (IInitEvent | IWorldStepEvent | IWorldUpdateEvent | IBuildBlockEvent | IRemoveBlockEvent) & {
  type: MessageType;
}
