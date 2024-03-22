import { ConversationContext } from '../context/ConversationsContext';
import { useContext } from 'react';

export const useConversationContext = () => {
  const context = useContext(ConversationContext);

  if (!context) {
    throw new Error(
      'useConversationContext must be used inside of a ConversationContextProvider',
    );
  }

  return context;
};
