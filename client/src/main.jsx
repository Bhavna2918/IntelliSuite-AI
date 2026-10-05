
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import ClerkWithTheme from './context/ClerkWithTheme.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
   <ThemeProvider>
     <ClerkWithTheme publishableKey={PUBLISHABLE_KEY} />
   </ThemeProvider>
)
