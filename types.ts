export type Animal =
  | 'rat'
  | 'spider'
  | 'snake'
  | 'bat'
  | 'boar'
  | 'wolf'
  | 'bear'
  | 'crocodile'
  | 'tiger'
  | 'elephant';

export type Config = {
  server: string;
  village: {
    x: number;
    y: number;
  };
  searchRadius: number;
  animals: Animal[];
};

export type AnimalInfo = { x: number; y: number; distance: number; animal: Animal };
