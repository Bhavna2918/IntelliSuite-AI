
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
        },
        elements: {
          modalContent: "scale-90 transform origin-center shadow-[0_0_50px_rgba(0,0,0,0.2)] rounded-2xl"
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
