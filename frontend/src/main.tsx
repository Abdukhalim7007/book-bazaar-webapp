import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { TelegramProvider } from './contexts/TelegramContext'
import '@/styles/main.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TelegramProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TelegramProvider>
  </StrictMode>,
)
