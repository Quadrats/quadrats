import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'Quadrats',
  brandUrl: 'https://github.com/Quadrats/quadrats'
});

addons.setConfig({
  theme,
  panelPosition: 'right',
  showRoots: true
});
