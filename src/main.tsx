import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App id="1" />
  </React.StrictMode>,
)
ReactDOM.createRoot(document.getElementById('root2') as HTMLElement).render(
  <React.StrictMode>
    <App id="2" />
  </React.StrictMode>,
)
