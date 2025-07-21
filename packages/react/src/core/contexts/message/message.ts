import { createContext, useContext } from 'react';

export interface MessageContextValue {
  success: (text: string) => void;
  warning: (text: string) => void;
  error: (text: string) => void;
  info: (text: string) => void;
}

export const MessageContext = createContext<MessageContextValue>({
  success: () => {},
  warning: () => {},
  error: () => {},
  info: () => {},
});

export function useMessage() {
  return useContext(MessageContext);
}
