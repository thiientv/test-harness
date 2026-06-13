import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#030308',
          color: '#ffffff',
          fontFamily: 'Consolas, Monaco, monospace',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ff3b3b', marginBottom: '20px' }}>⚠️ System Crash Detected</h1>
          <p style={{ maxWidth: '600px', marginBottom: '20px', color: '#ccd' }}>
            The 3D interactive graphics pipeline encountered an unrecoverable runtime exception or your graphics driver crashed.
          </p>
          <div style={{
            backgroundColor: 'rgba(255, 59, 59, 0.1)',
            border: '1px solid #ff3b3b',
            borderRadius: '4px',
            padding: '16px',
            maxWidth: '800px',
            textAlign: 'left',
            overflowX: 'auto',
            marginBottom: '30px'
          }}>
            <strong style={{ color: '#ff5b5b' }}>Error message:</strong> {this.state.error?.message}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid #00f0ff',
              color: '#00f0ff',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Restart OS Session
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
