export const getVariantType = (parentType: string, variant?: string) => `${parentType}${variant ? `.${variant}` : ''}`;
