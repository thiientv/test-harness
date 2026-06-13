import { describe, it, expect } from 'vitest'
import { isWebGLAvailable } from './webglCheck'

describe('isWebGLAvailable', () => {
  it('should return boolean status of webgl', () => {
    const val = isWebGLAvailable()
    expect(typeof val).toBe('boolean')
  })
})
