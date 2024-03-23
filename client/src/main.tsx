import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './reset.module.scss';
import './index.module.scss';
import { AuthContextProvider } from './context/AuthContext.tsx';
import { NotificationContextProvider } from './context/NotificationsContext.tsx';
import SocketContextProvider from './context/SocketContext.tsx';
import { ConversationContextProvider } from './context/ConversationsContext.tsx';
import { io } from 'socket.io-client';

const API_SOCKET_URL: string =
  import.meta.env.VITE_SOCKET_URL || 'ws://localhost:4000';

const socket = io(API_SOCKET_URL);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider socket={socket}>
        <ConversationContextProvider>
          <NotificationContextProvider>
            <App />
          </NotificationContextProvider>
        </ConversationContextProvider>
      </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
