export type Config = {
  server: string;
  village: {
    x: number;
    y: number;
  };
  searchRadius: number;
  cages: number;
};

export type Oasis = { x: number; y: number; distance: number; score: number };
