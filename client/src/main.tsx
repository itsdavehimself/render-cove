import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './reset.module.scss';
import './index.module.scss';
import { AuthContextProvider } from './context/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
);
