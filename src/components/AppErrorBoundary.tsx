import React from 'react';

interface State {
  hasError: boolean;
  errorMessage: string;
}

class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'Unknown runtime error';
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: unknown) {
    console.error('App crashed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass" style={{ maxWidth: '680px', width: '100%', borderRadius: '14px', padding: '1rem 1.25rem' }}>
            <h2 style={{ marginBottom: '0.6rem' }}>Runtime Error</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              The app hit a client-side error. Refresh after changes, or share this message:
            </p>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#fca5a5', fontSize: '0.85rem' }}>
              {this.state.errorMessage}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;

