export type Config = {
  server: string;
  village: {
    x: number;
    y: number;
  };
  searchRadius: number;
};

export type AnimalInfo = { x: number; y: number; distance: number; elephants: number };
