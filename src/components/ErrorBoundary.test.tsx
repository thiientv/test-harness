import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

// Create a component that commits a syntax error on render to test boundary capabilities
const CrashComponent = () => {
  throw new Error('Canvas render exception details')
}

describe('ErrorBoundary', () => {
  it('should render fallback content when children crash', () => {
    // Suppress console.error in tests to clean output warnings
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <CrashComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText(/System Exception Detected/i)).toBeDefined()
    expect(screen.getByText(/Canvas render exception details/i)).toBeDefined()
    
    spy.mockRestore()
  })

  it('should render children when no crash occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal Content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Normal Content')).toBeDefined()
  })
})
