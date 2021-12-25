import React, { useState } from 'react';
import { THEME_QDR, THEME_QDR_DARK } from '@quadrats/theme';
import { enUS, zhTW } from '@quadrats/locales';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import PlaygroudEditor, { PlaygroudEditorProps } from '../components/PlaygroudEditor';

export default {
  title: 'Examples/Playgroud',
};

export const All = ({ darkMode, localeName }: { darkMode: boolean; localeName: string }) => {
  const theme = darkMode ? THEME_QDR_DARK : THEME_QDR;
  const locales = [enUS, zhTW];
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

All.args = {
  darkMode: false,
  localeName: enUS.locale,
};

All.argTypes = {
  localeName: {
    control: {
      type: 'select',
    },
    options: [enUS, zhTW].map(({ locale }) => locale),
  },
};
