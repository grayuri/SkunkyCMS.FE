import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import DatabaseContextProvider from './context/DatabaseContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DatabaseContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DatabaseContextProvider>
  </React.StrictMode>,
)
