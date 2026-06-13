import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { isWebGLAvailable } from './utils/webglCheck.ts'
import './index.css'

function init() {
  const rootEl = document.getElementById('root')!

  if (!isWebGLAvailable()) {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
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
          <h1 style={{ color: '#ff3b3b', marginBottom: '20px' }}>⚠️ WebGL Not Supported</h1>
          <p style={{ maxWidth: '600px', color: '#ccd' }}>
            Your browser or device does not support WebGL, which is required overlaying the 3D developer portfolio.
          </p>
        </div>
      </React.StrictMode>
    )
    return
  }

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
}

init()
