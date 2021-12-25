export type QuadratsElement = {
  type: string;
  children: (QuadratsElement | QuadratsText)[];
};

export type QuadratsText = {
  text: string
};
