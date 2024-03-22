import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './reset.module.scss';
import './index.module.scss';
import { AuthContextProvider } from './context/AuthContext.tsx';
import { NotificationContextProvider } from './context/NotificationsContext.tsx';
import { ConversationContextProvider } from './context/ConversationsContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ConversationContextProvider>
        <NotificationContextProvider>
          <App />
        </NotificationContextProvider>
      </ConversationContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
