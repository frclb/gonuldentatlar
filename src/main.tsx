import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initAnalytics } from './lib/analytics'
import './index.css'

// Daha önce onay verilmişse ölçümü başlat; aksi hâlde hiçbir şey yüklenmez
initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
