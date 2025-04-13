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

// Chakra UI v.3.15.1
// https://chakra-ui.com/docs/get-started/frameworks/vite
// Follow these steps properly and check migration also for reference
//https://chakra-ui.com/docs/get-started/migration