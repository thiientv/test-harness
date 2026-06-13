import { useState } from 'react'
import { Html } from '@react-three/drei'
import { TargetView } from '../App'
import { ExternalLink, Database, Cpu, Terminal, Sparkles } from 'lucide-react'
import { NEON_THEME } from '../constants/theme'

interface ServerRackProps {
  currentView: TargetView
  onViewChange: (view: TargetView) => void
}

interface ProjectData {
  title: string
  tech: string[]
  desc: string
  linkName: string
  state: 'online' | 'standby' | 'syncing'
  logs: string[]
}

const PROJECTS: ProjectData[] = [
  {
    title: 'Holographic Workspace Simulator',
    tech: ['TypeScript', 'Three.js', 'React Three Fiber', 'Shaders'],
    desc: 'Immersive 3D interactive workspace room built with modular mesh structures, real-time lighting glows, camera tweening, and custom sub-shell terminal systems.',
    linkName: 'holo-workspace.git',
    state: 'online',
    logs: [
      'SYS: Initializing canvas webgl context...',
      'SYS: Compile shader programs successfully.',
      'SYS: Orbit camera targets locked.',
      'DECK: Active listener binding to keyboard and monitor mesh.'
    ]
  },
  {
    title: 'Quantum Ledger API Service',
    tech: ['Golang', 'Postgres', 'GraphQL', 'Docker', 'Redis'],
    desc: 'High throughput, containerized ledger indexing and caching engine. Capable of handling 15,000 requests/sec with robust rate limiting and telemetry integrations.',
    linkName: 'ledger-service.git',
    state: 'syncing',
    logs: [
      'DB: Connect postgres pools on port 5432...',
      'SYS: Spinning up go metrics telemetry dashboard.',
      'REDIS: Cached index syncing (94%).',
      'ALERT: Rate limit threshold set to 2k req/min.'
    ]
  },
  {
    title: 'Cognitive Engine Model Pipeline',
    tech: ['Node.js', 'Express', 'Python', 'WebSockets', 'PyTorch'],
    desc: 'Microservices pipeline transforming and sanitizing live socket event buffers before feeding them into tensor classification algorithms.',
    linkName: 'cognitive-engine.git',
    state: 'standby',
    logs: [
      'MODEL: Model checkpoint loaded (v2.1-stable).',
      'WS: Awaiting handshake on port 8080...',
      'SYS: Pipeline standby, energy mode active.'
    ]
  }
]

export default function ServerRack({ currentView, onViewChange }: ServerRackProps) {
  const [hovered, setHovered] = useState(false)
  const [activeProjectIdx, setActiveProjectIdx] = useState(0)
  const isFocused = currentView === 'server'

  return (
    <group position={[-1.8, 0.75, -0.4]}>
      {/* 1. Main Server Cabinet/Rack Structure */}
      <mesh
        castShadow
        receiveShadow
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
          onViewChange('server')
        }}
      >
        <boxGeometry args={[0.8, 1.2, 0.6]} />
        <meshStandardMaterial
          color={hovered && !isFocused ? '#1d1526' : '#0d0812'}
          roughness={0.7}
          metalness={0.8}
        />
      </mesh>

      {/* Pulsing glow outline if hovered and not focused */}
      {hovered && !isFocused && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.84, 1.24, 0.64]} />
          <meshBasicMaterial color={NEON_THEME.purple} transparent opacity={0.3} />
        </mesh>
      )}

      {/* 2. Horizontal Server Drawer Units */}
      {[0, 1, 2].map((idx) => {
        const yOffset = 0.35 - idx * 0.35
        const isActive = isFocused && activeProjectIdx === idx
        const project = PROJECTS[idx] || PROJECTS[0] // Medium Issue 2 Safeguard

        return (
          <group key={idx} position={[0, yOffset, 0.01]}>
            {/* Drawer Front Plate */}
            <mesh
              onClick={(e) => {
                e.stopPropagation()
                onViewChange('server')
                setActiveProjectIdx(idx)
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                // Handled at group level
              }}
            >
              <boxGeometry args={[0.72, 0.28, 0.6]} />
              <meshStandardMaterial
                color={isActive ? '#1a0b2d' : '#120b1c'}
                roughness={0.5}
                metalness={0.9}
              />
            </mesh>

            {/* Glowing Drawer separator/LED line */}
            <mesh position={[0, -0.13, 0.31]}>
              <boxGeometry args={[0.66, 0.015, 0.01]} />
              <meshBasicMaterial color={isActive ? NEON_THEME.cyan : NEON_THEME.purple} />
            </mesh>

            {/* Blinking indicator LED lights (Green/Cyan/Red) */}
            <mesh position={[-0.28, 0.05, 0.31]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial
                color={project.state === 'online' ? NEON_THEME.green : project.state === 'syncing' ? NEON_THEME.cyan : '#ffa500'}
              />
            </mesh>
            <mesh position={[-0.24, 0.05, 0.31]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>
            <mesh position={[-0.2, 0.05, 0.31]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#ff00ff" />
            </mesh>

            {/* Grid ventilator mesh details */}
            <mesh position={[0.1, 0, 0.31]}>
              <boxGeometry args={[0.4, 0.1, 0.005]} />
              <meshStandardMaterial color="#050308" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        )
      })}

      {/* 3. Drei HTML Projects overlay interface (Only visible when server view is active) */}
      {isFocused && (
        <Html
          position={[0.5, 0, 0.35]}
          distanceFactor={1.2}
          center
        >
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              width: '320px',
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--neon-purple)',
              boxShadow: '0 8px 32px 0 rgba(189, 0, 255, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              color: '#ffffff',
            }}
          >
            {/* Header / Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-purple)', fontWeight: 'bold', fontSize: '12px' }}>
                <Database size={16} />
                <span>SERVER_UNITS ({PROJECTS.length})</span>
              </div>
              <span className="pulse-led" style={{ fontSize: '9px', color: 'var(--neon-green)' }}>
                ● DECK_SAFE
              </span>
            </div>

            {/* Drawer Tabs (Simulated select tabs) */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {PROJECTS.map((_proj, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveProjectIdx(idx)}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    fontSize: '9px',
                    borderRadius: '4px',
                    border: '1px solid',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    borderColor: activeProjectIdx === idx ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.1)',
                    backgroundColor: activeProjectIdx === idx ? 'rgba(0, 240, 255, 0.1)' : 'rgba(0,0,0,0.3)',
                    color: activeProjectIdx === idx ? 'var(--neon-cyan)' : '#888',
                    transition: 'all 0.15s ease-in-out'
                  }}
                >
                  UNIT_0{idx + 1}
                </button>
              ))}
            </div>

            {/* Active Project details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--neon-purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} />
                {(PROJECTS[activeProjectIdx] || PROJECTS[0]).title}
              </h3>
              
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                {(PROJECTS[activeProjectIdx] || PROJECTS[0]).tech.map((t, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      color: 'var(--neon-cyan)',
                      border: '1px solid rgba(0,240,255,0.15)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <p style={{ fontSize: '11px', color: '#cce', lineHeight: '1.4', marginTop: '6px' }}>
                {(PROJECTS[activeProjectIdx] || PROJECTS[0]).desc}
              </p>
            </div>

            {/* Micro Server logs system */}
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '4px', padding: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '8px', color: '#6a7' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '3px', marginBottom: '4px', color: '#889', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Terminal size={10} />
                <span>UNIT_0{activeProjectIdx + 1} LIVE PROCESS LOGS:</span>
              </div>
              {(PROJECTS[activeProjectIdx] || PROJECTS[0]).logs.map((log, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-mono)', lineHeight: '1.3' }}>
                  {log}
                </div>
              ))}
            </div>

            {/* Link out button */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                alert(`Clone repository target: https://github.com/agent-alex/${(PROJECTS[activeProjectIdx] || PROJECTS[0]).linkName}`)
              }}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px',
                padding: '8px 0',
                border: '1px solid var(--neon-purple)',
                background: 'rgba(189,0,255,0.08)',
                color: 'var(--neon-purple)',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              className="hud-interactive"
            >
              <Cpu size={12} />
              <span>REQUEST SOURCE REPO</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </Html>
      )}
    </group>
  )
}
