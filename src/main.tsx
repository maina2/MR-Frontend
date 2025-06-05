import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './store/authContext';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
     </StrictMode>,
)
