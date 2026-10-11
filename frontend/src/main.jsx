import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Store from './store/store.js'
import { AuthProvider } from './authContext/authContext.jsx'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Provider store={Store}>
        <App />
      </Provider>
    </BrowserRouter>
  </AuthProvider>
)
