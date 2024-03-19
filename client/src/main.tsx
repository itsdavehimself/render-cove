import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './reset.module.scss';
import './index.module.scss';
import { AuthContextProvider } from './context/AuthContext.tsx';
import { NotificationContextProvider } from './context/NotificationsContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NotificationContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </NotificationContextProvider>
  </React.StrictMode>,
);
