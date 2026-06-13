import React, { useState, useRef, useEffect } from 'react'
import { Html } from '@react-three/drei'
import { TargetView } from '../App'

interface MonitorProps {
  currentView: TargetView
  onViewChange: (view: TargetView) => void
}

interface LogLine {
  text: string
  type: 'input' | 'output' | 'error' | 'success'
}

export default function Monitor({ currentView, onViewChange }: MonitorProps) {
  const [hovered, setHovered] = useState(false)
  const isFocused = currentView === 'monitor'

  // Terminal state management
  const [inputVal, setInputVal] = useState('')
  const [logs, setLogs] = useState<LogLine[]>([
    { text: '==============================================', type: 'success' },
    { text: '   NEO-SYSTEM OS DECK v2026.06.13 ONLINE   ', type: 'success' },
    { text: '==============================================', type: 'success' },
    { text: 'Type "help" for a list of available system commands.', type: 'output' },
    { text: '', type: 'output' },
  ])
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  // Focus input field when monitor target is active
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const rawCmd = inputVal.trim()
    if (!rawCmd) return

    const newLogs = [...logs, { text: `$ ${rawCmd}`, type: 'input' as const }]
    const command = rawCmd.toLowerCase().split(' ')[0]

    switch (command) {
      case 'help':
        newLogs.push(
          { text: 'Available commands:', type: 'success' },
          { text: '  about      - Display overview of developer profile', type: 'output' },
          { text: '  skills     - Render skill stats matrix info', type: 'output' },
          { text: '  projects   - Show repository server details', type: 'output' },
          { text: '  clear      - Clear the console output history', type: 'output' },
          { text: '  matrix     - Activate cyber screen rain demo', type: 'success' },
          { text: '  exit       - Exit full screen focus view mode', type: 'output' }
        )
        break
      case 'about':
        newLogs.push(
          { text: '=== DEVELOPER BIOGRAPHY ===', type: 'success' },
          { text: 'Name: Agent Alex Mercer', type: 'output' },
          { text: 'Role: Senior Full Stack / 3D Graphics Engineer', type: 'output' },
          { text: 'Bio: Crafting next-generation immersive web interfaces with optimal speed', type: 'output' },
          { text: '     and robust systems architectures.', type: 'output' }
        )
        break
      case 'skills':
        newLogs.push(
          { text: '=== CORE TECH MATRIX ===', type: 'success' },
          { text: '  - Frontend: React, TypeScript, Next.js, HTML5/CSS3', type: 'output' },
          { text: '  - Immersive: Three.js, React Three Fiber, Custom Shaders', type: 'output' },
          { text: '  - Backend: Node.js, Express, Go, Postgres, Docker', type: 'output' }
        )
        onViewChange('keyboard')
        break
      case 'projects':
        newLogs.push(
          { text: 'Routing system camera deck to server rack node logs...', type: 'output' }
        )
        onViewChange('server')
        break
      case 'clear':
        setLogs([])
        setInputVal('')
        return
      case 'matrix':
        newLogs.push(
          { text: 'Wake up, Alex...', type: 'error' },
          { text: 'The Matrix has you...', type: 'error' },
          { text: 'Follow the white rabbit. 🐇', type: 'error' }
        )
        break
      case 'exit':
        newLogs.push({ text: 'Exiting focus mode. Goodbye.', type: 'output' })
        onViewChange('home')
        break
      default:
        newLogs.push({
          text: `Command not found: "${command}". Type "help" for support.`,
          type: 'error',
        })
    }

    setLogs(newLogs)
    setInputVal('')
  }

  return (
    <group position={[0, 0.75, -0.4]}>
      {/* 1. Monitor Base / Stand */}
      <mesh position={[0, 0.05, -0.1]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.4]} />
        <meshStandardMaterial color="#0c0c10" roughness={0.7} metalness={0.9} />
      </mesh>
      
      {/* 2. Monitor Neck / Arm */}
      <mesh position={[0, 0.25, -0.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.4]} />
        <meshStandardMaterial color="#0c0c10" roughness={0.7} metalness={0.9} />
      </mesh>

      {/* 3. Screen Bezel & Case */}
      <mesh
        position={[0, 0.5, -0.2]}
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
        }}
        onClick={(e) => {
          e.stopPropagation()
          onViewChange('monitor')
        }}
      >
        <boxGeometry args={[1.7, 1.0, 0.08]} />
        <meshStandardMaterial
          color={hovered && !isFocused ? '#1b3240' : '#0c0c10'}
          roughness={0.5}
          metalness={0.9}
        />
      </mesh>

      {/* 4. Display screen mesh */}
      <mesh position={[0, 0.5, -0.15]} onClick={(e) => {
        e.stopPropagation()
        onViewChange('monitor')
      }}>
        <planeGeometry args={[1.6, 0.9]} />
        <meshStandardMaterial color="#030805" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* 5. Glowing Neon Frame indicator to indicate interactivity */}
      {hovered && !isFocused && (
        <mesh position={[0, 0.5, -0.155]}>
          <planeGeometry args={[1.64, 0.94]} />
          <meshBasicMaterial color="var(--neon-cyan)" transparent opacity={0.6} />
        </mesh>
      )}

      {/* 6. Drei HTML Interactive Shell */}
      <Html
        transform
        distanceFactor={0.8}
        position={[0, 0.5, -0.145]}
        occlude="blending"
      >
        <div 
          className="screen-terminal-container"
          onClick={(e) => {
            e.stopPropagation()
            if (!isFocused) {
              onViewChange('monitor')
            }
          }}
          style={{
            cursor: isFocused ? 'text' : 'pointer',
            borderWidth: isFocused ? '1px' : '0px',
            borderColor: isFocused ? 'var(--neon-green)' : 'rgba(57, 255, 20, 0.15)',
          }}
        >
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(57, 255, 20, 0.2)', paddingBottom: '4px', marginBottom: '8px', fontSize: '11px', color: 'rgba(57, 255, 20, 0.7)' }}>
            <span>Terminal: alex@mercer-workspace:~</span>
            <span>⏺ Min ⏺ Max ✖</span>
          </div>

          {/* Logs Terminal History */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '30px' }}>
            {logs.map((log, i) => {
              let color = '#ccc'
              if (log.type === 'input') color = '#00f0ff'
              else if (log.type === 'success') color = 'var(--neon-green)'
              else if (log.type === 'error') color = '#ff3b3b'
              
              return (
                <div key={i} style={{ color, wordBreak: 'break-all', whiteSpace: 'pre-wrap', lineHeight: '1.3' }}>
                  {log.text}
                </div>
              )
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Console submission line */}
          {isFocused ? (
            <form onSubmit={handleTerminalSubmit} style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', borderTop: '1px solid rgba(57, 255, 20, 0.15)', paddingTop: '6px', backgroundColor: 'rgba(3,10,5,0.95)' }}>
              <span style={{ color: 'var(--neon-cyan)', marginRight: '6px' }}>alex$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--neon-green)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                }}
              />
              <span className="terminal-cursor"></span>
            </form>
          ) : (
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', color: '#ffb900', fontSize: '11px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '4px' }}>
              [ CLICK SCREEN TO ACTIVATE OS TERMINAL ]
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
