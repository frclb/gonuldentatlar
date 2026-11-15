import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initAnalytics } from './lib/analytics'
import { initImageRetry } from './lib/imageRetry'
import './index.css'

// Daha önce onay verilmişse ölçümü başlat; aksi hâlde hiçbir şey yüklenmez
initAnalytics()
// Anlık bağlantı kopmasında görseli bir kez yeniden dene, olmazsa kırık simge gösterme
initImageRetry()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
