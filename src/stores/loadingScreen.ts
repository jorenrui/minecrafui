import { atom } from 'jotai';

export const loadingScreenAtom = atom({
  show: false,
  message: '',
});
