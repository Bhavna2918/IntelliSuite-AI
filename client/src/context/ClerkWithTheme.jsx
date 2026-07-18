
import { dark } from '@clerk/themes';
import { useTheme } from './ThemeContext';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

const ClerkWithTheme = ({ publishableKey }) => {
  const { theme } = useTheme();

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: '#3B82F6', // Using the blue accent from our premium theme
        }
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  );
};

export default ClerkWithTheme;
