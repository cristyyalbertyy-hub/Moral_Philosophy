import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { AuthGate } from './components/AuthGate';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AuthGate appTitle="Moral Philosophy">
        <App />
      </AuthGate>
    </AuthProvider>
  </StrictMode>,
);
