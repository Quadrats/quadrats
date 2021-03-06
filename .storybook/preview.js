import { DocsPage } from '@storybook/addon-docs/blocks';
import '../stories/stories.scss';

export const parameters = {
  docs: { page: DocsPage },
  options: {
    storySort: {
      order: [
        'Docs',
        ['Intro', 'Getting Started', 'Theme', 'Locales', 'Icons', 'Utils'],
        'Examples',
        'React',
        'Elements',
        ['Paragraph'],
        'Marks',
        'Handlers',
        'Widgets',
        'Serializers'
      ]
    }
  }
};
