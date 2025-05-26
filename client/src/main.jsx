import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from '@/components/ui/provider';
import { ThemeProvider } from 'next-themes';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';

const client_id = '452869840515-b7cis26rr4pdnmqilqt348vngk44e249.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Provider>
        <GoogleOAuthProvider clientId={client_id}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

// Chakra UI v.3.15.1
// https://chakra-ui.com/docs/get-started/frameworks/vite
// Follow these steps properly and check migration also for reference
//https://chakra-ui.com/docs/get-started/migration