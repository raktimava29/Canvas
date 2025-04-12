import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from "@/components/ui/provider"
import { ThemeProvider } from "next-themes"
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <ThemeProvider>
    <Provider>
      <App />
    </Provider>
    </ThemeProvider>
  </React.StrictMode>
)
