import { describe, it, expect, vi } from 'vitest'
import { evaluateCommand } from '../utils/terminalEvaluator'

describe('terminalEvaluator', () => {
  it('should return empty array on empty input', () => {
    const onViewChange = vi.fn()
    const result = evaluateCommand('', onViewChange)
    expect(result).toEqual([])
  })

  it('should process help command', () => {
    const onViewChange = vi.fn()
    const result = evaluateCommand('help', onViewChange)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].text).toContain('Available commands:')
  })

  it('should process about command', () => {
    const onViewChange = vi.fn()
    const result = evaluateCommand('about', onViewChange)
    expect(result.length).toBeGreaterThan(0)
    expect(result[1].text).toContain('Name: Agent Alex Mercer')
  })

  it('should route to keyboard on skills command', () => {
    const onViewChange = vi.fn()
    const result = evaluateCommand('skills', onViewChange)
    expect(result.length).toBeGreaterThan(0)
    expect(onViewChange).toHaveBeenCalledWith('keyboard')
  })

  it('should route to server on projects command', () => {
    const onViewChange = vi.fn()
    const result = evaluateCommand('projects', onViewChange)
    expect(result.length).toBeGreaterThan(0)
    expect(onViewChange).toHaveBeenCalledWith('server')
  })

  it('should process matrix command', () => {
    const onViewChange = vi.fn()
    const result = evaluateCommand('matrix', onViewChange)
    expect(result.some(line => line.text.includes('Follow the white rabbit'))).toBe(true)
  })

  it('should route to home on exit command', () => {
    const onViewChange = vi.fn()
    evaluateCommand('exit', onViewChange)
    expect(onViewChange).toHaveBeenCalledWith('home')
  })

  it('should handle unknown command', () => {
    const onViewChange = vi.fn()
    const result = evaluateCommand('invalidcmd', onViewChange)
    expect(result[0].type).toBe('error')
    expect(result[0].text).toContain('Command not found: "invalidcmd"')
  })
})
