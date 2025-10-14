import { createContext, useContext } from 'react';
import { MessageSeverity } from '@quadrats/react/components';

export interface MessageContextValue {
  message: ({ type, content, duration }: { type?: MessageSeverity; content: string; duration?: number }) => void;
}

export const MessageContext = createContext<MessageContextValue>({
  message: () => {},
});

export function useMessage() {
  return useContext(MessageContext);
}
