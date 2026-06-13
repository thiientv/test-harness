"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('System pipeline crash:', error, errorInfo)
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#010103',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ff3b3b', marginBottom: '20px', fontSize: '2rem', fontWeight: 'bold' }}>
            ⚠️ System Exception Detected
          </h1>
          <p style={{ maxWidth: '600px', marginBottom: '20px', color: '#ccd' }}>
            The 3D interactive neural network canvas encountered an unrecoverable runtime exception or your graphics process crashed.
          </p>
          <div style={{
            backgroundColor: 'rgba(255, 59, 59, 0.1)',
            border: '1px solid #ff3b3b',
            borderRadius: '6px',
            padding: '16px',
            maxWidth: '800px',
            textAlign: 'left',
            overflowX: 'auto',
            marginBottom: '30px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            <strong style={{ color: '#ff5b5b' }}>Traceback:</strong> {this.state.error?.message || this.state.error?.toString()}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid #00f0ff',
              color: '#00f0ff',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
          >
            Reinitialize Neural Engine
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
