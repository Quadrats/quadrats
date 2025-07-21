import React, { ReactNode, useCallback, useContext } from 'react';
import { MessageSeverity, Message } from '@quadrats/react/components';
import { ThemeContext } from '@quadrats/react/configs';
import { MessageContext } from './message';

export interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const { props: themeProps } = useContext(ThemeContext);

  const message = useCallback(
    ({ type, content, duration }: { type?: MessageSeverity; content: string; duration?: number }) => {
      switch (type) {
        case 'info': {
          Message.info(content, themeProps, { duration });
          break;
        }

        case 'error': {
          Message.error(content, themeProps, { duration });
          break;
        }

        case 'warning': {
          Message.warning(content, themeProps, { duration });
          break;
        }

        case 'success': {
          Message.success(content, themeProps, { duration });
          break;
        }

        default: {
          Message.info(content, themeProps, { duration });
          break;
        }
      }
    },
    [themeProps],
  );

  return <MessageContext.Provider value={{ message }}>{children}</MessageContext.Provider>;
};
