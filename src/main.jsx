import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { WatchlistProvider } from './context/WatchlistContext'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import '@fontsource/raleway/300.css'
import '@fontsource/raleway/400.css'
import '@fontsource/raleway/700.css'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Create a dark theme inspired by movie streaming sites
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e50914' // Netflix‑like red accent
    },
    secondary: {
      main: '#b81c24'
    },
    background: {
      default: '#0d0f11',
      paper: '#16181d'
    }
  },
  typography: {
    fontFamily: 'Raleway, sans-serif',
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.015em'
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.015em'
    },
    h4: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 500
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}
      navigate={to => {
        window.history.pushState(null, '', to)
      }}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <WatchlistProvider>
            <App />
          </WatchlistProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
