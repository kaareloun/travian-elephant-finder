import { ANIMALS } from './constants';

export type Config = {
  server: string;
  village: {
    x: number;
    y: number;
  };
  searchRadius: number;
  cages: number;
};

export type Oasis = {
  x: number;
  y: number;
  distance: number;
  animals: Set<keyof typeof ANIMALS>;
  score: number;
};
