import { atom } from 'jotai';

export const colorAtom = atom(`#${Math.floor(Math.random()*16777215).toString(16)}`);
