import { Info, X } from 'lucide-react';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#fee2e2', color: '#991b1b', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Something went wrong.</h1>
          <p style={{ marginBottom: '1rem' }}>The application crashed. Please share this error message:</p>
          <pre style={{ backgroundColor: '#f87171', color: '#450a0a', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <pre style={{ backgroundColor: '#fca5a5', color: '#450a0a', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto', marginTop: '1rem', fontSize: '0.875rem' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
