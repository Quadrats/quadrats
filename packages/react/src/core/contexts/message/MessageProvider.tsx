import React, { ReactNode, useCallback, useContext } from 'react';
import { Message } from '@quadrats/react/components';
import { ThemeContext } from '@quadrats/react/configs';
import { MessageContext } from './message';

export interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const { props: themeProps } = useContext(ThemeContext);

  const success = useCallback(
    (text: string) => {
      Message.success(text, themeProps);
    },
    [themeProps],
  );

  const warning = useCallback(
    (text: string) => {
      Message.warning(text, themeProps);
    },
    [themeProps],
  );

  const error = useCallback(
    (text: string) => {
      Message.error(text, themeProps);
    },
    [themeProps],
  );

  const info = useCallback(
    (text: string) => {
      Message.info(text, themeProps);
    },
    [themeProps],
  );

  return <MessageContext.Provider value={{ success, warning, error, info }}>{children}</MessageContext.Provider>;
};
