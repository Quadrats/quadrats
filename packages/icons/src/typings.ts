export interface IconDefinition {
  name: string;
  definition: {
    svg?: {
      viewBox?: string;
    };
    path?: {
      d?: string;
      fill?: string;
      fillRule?: 'nonzero' | 'evenodd' | 'inherit';
      strokeWidth?: string | number;
    };
  };
}
