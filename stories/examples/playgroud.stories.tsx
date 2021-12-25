import { boolean, select } from '@storybook/addon-knobs';

import React, { useState } from 'react';
import { THEME_QDR, THEME_QDR_DARK } from '@quadrats/theme';
import { enUS, zhTW } from '@quadrats/locales';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import PlaygroudEditor, { PlaygroudEditorProps } from '../components/PlaygroudEditor';

export default {
  title: 'Examples/Playgroud',
};

export const All = () => {
  const theme = boolean('dark mode', false, 'editor') ? THEME_QDR_DARK : THEME_QDR;
  const locales = [enUS, zhTW];
  const localeNames = locales.map(({ locale }) => locale);
  const localeName = select('locale', localeNames, enUS.locale, 'editor');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const locale = locales.find(({ locale: name }) => name === localeName)!;
  const Editor = ({ theme, locale }: Pick<PlaygroudEditorProps, 'theme' | 'locale'>) => {
    const [value, setValue] = useState<Descendant[]>([
      {
        type: PARAGRAPH_TYPE,
        children: [{ text: '' }],
      },
    ]);

    return <PlaygroudEditor theme={theme} locale={locale} value={value} setValue={setValue} />;
  };

  return <Editor theme={theme} locale={locale} />;
};
