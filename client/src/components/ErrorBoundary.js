import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You could log the error to an external service here
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem' }}>
          <h2>Something went wrong</h2>
          <p>We encountered an unexpected error while loading this section. Try refreshing or report the issue.</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {String(this.state.error)}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
