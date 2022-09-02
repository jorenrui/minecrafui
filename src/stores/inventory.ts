import { BLOCK_TYPE } from '@lib/constants/blocks';
import { atom } from 'jotai';

export const selectedBlockAtom = atom(BLOCK_TYPE.grass);
export const bagAtom = atom([...Object.values(BLOCK_TYPE)]);
