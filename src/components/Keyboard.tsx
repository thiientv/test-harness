import { useState } from 'react'
import { Html } from '@react-three/drei'
import { TargetView } from '../App'

interface KeyboardProps {
  currentView: TargetView
  onViewChange: (view: TargetView) => void
}

interface SkillDetails {
  name: string
  level: string
  desc: string
  icon: string
  years: string
}

const SKILL_DATA: Record<string, SkillDetails> = {
  esc: { name: 'System / Infrastructure', level: 'Advanced', desc: 'Docker, CI/CD, Git, GitHub Actions, AWS provisioning, Bash scripting, Linux CLI administration.', icon: '⚙️', years: '3+ yrs' },
  numbers: { name: 'Backend Services', level: 'Expert', desc: 'Node.js, Express, Go (Golang), PostgreSQL, REST APIs, GraphQL, database indexing and speed optimizations.', icon: '💾', years: '4+ yrs' },
  alphas: { name: 'Frontend Engineering', level: 'Senior', desc: 'TypeScript, JavaScript (ESNext), React, state managers (Redux, Zustand), responsive styling frameworks, clean code.', icon: '⚛️', years: '5+ yrs' },
  space: { name: '3D Mechanics / Graphics', level: 'Intermediate', desc: 'Three.js, React Three Fiber (R3F), Drei helper library, interactive shaders (GLSL), canvas frame optimization.', icon: '⚡', years: '2+ yrs' }
}

export default function Keyboard({ currentView, onViewChange }: KeyboardProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [hoveredBoard, setHoveredBoard] = useState(false)
  const isFocused = currentView === 'keyboard'

  // Standard keyboard dimensions
  // width: 0.8, depth: 0.3, height: 0.04
  return (
    <group position={[0, 0.77, 0.4]}>
      {/* 1. Keyboard Case/Body */}
      <mesh
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredBoard(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHoveredBoard(false)
          setHoveredZone(null)
        }}
        onClick={(e) => {
          e.stopPropagation()
          onViewChange('keyboard')
        }}
      >
        <boxGeometry args={[0.9, 0.05, 0.3]} />
        <meshStandardMaterial
          color={hoveredBoard && !isFocused ? '#1d1d26' : '#0a0a0f'}
          roughness={0.6}
          metalness={0.9}
        />
      </mesh>

      {/* Glow frame if hovered and not focused */}
      {hoveredBoard && !isFocused && (
        <mesh position={[0, -0.01, 0]}>
          <boxGeometry args={[0.94, 0.06, 0.34]} />
          <meshBasicMaterial color="var(--neon-cyan)" transparent opacity={0.3} />
        </mesh>
      )}

      {/* 2. Key Switch matrix rows (Interactive regions) */}
      
      {/* ESC & Function row (Top left red/orange glowing region) */}
      <mesh
        position={[-0.32, 0.035, -0.1]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredZone('esc')
        }}
        onClick={(e) => {
          e.stopPropagation()
          onViewChange('keyboard')
          setHoveredZone('esc')
        }}
      >
        <boxGeometry args={[0.18, 0.03, 0.06]} />
        <meshStandardMaterial
          color={hoveredZone === 'esc' ? '#ff3b3b' : '#cc2222'}
          emissive={hoveredZone === 'esc' ? '#ff3b3b' : '#330000'}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Number row (Top main cyan glowing region) */}
      <mesh
        position={[0.08, 0.035, -0.1]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredZone('numbers')
        }}
        onClick={(e) => {
          e.stopPropagation()
          onViewChange('keyboard')
          setHoveredZone('numbers')
        }}
      >
        <boxGeometry args={[0.54, 0.03, 0.06]} />
        <meshStandardMaterial
          color={hoveredZone === 'numbers' ? 'var(--neon-cyan)' : '#0099aa'}
          emissive={hoveredZone === 'numbers' ? 'var(--neon-cyan)' : '#002233'}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Alphas Grid (Main middle green glowing region) */}
      <mesh
        position={[-0.04, 0.035, 0.0]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredZone('alphas')
        }}
        onClick={(e) => {
          e.stopPropagation()
          onViewChange('keyboard')
          setHoveredZone('alphas')
        }}
      >
        <boxGeometry args={[0.74, 0.03, 0.1]} />
        <meshStandardMaterial
          color={hoveredZone === 'alphas' ? 'var(--neon-green)' : '#22aa11'}
          emissive={hoveredZone === 'alphas' ? 'var(--neon-green)' : '#052200'}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Spacebar & Modifiers (Bottom purple glowing region) */}
      <mesh
        position={[0, 0.035, 0.1]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHoveredZone('space')
        }}
        onClick={(e) => {
          e.stopPropagation()
          onViewChange('keyboard')
          setHoveredZone('space')
        }}
      >
        <boxGeometry args={[0.6, 0.03, 0.06]} />
        <meshStandardMaterial
          color={hoveredZone === 'space' ? 'var(--neon-purple)' : '#7700aa'}
          emissive={hoveredZone === 'space' ? 'var(--neon-purple)' : '#220033'}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* 3. Drei HTML Skill matrix popups */}
      {hoveredZone && SKILL_DATA[hoveredZone] && (
        <Html
          position={[0, 0.18, 0]}
          center
          distanceFactor={1.2}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '12px 16px',
              width: '260px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              border: `1px solid ${
                hoveredZone === 'esc'
                  ? '#ff3b3b'
                  : hoveredZone === 'numbers'
                  ? 'var(--neon-cyan)'
                  : hoveredZone === 'alphas'
                  ? 'var(--neon-green)'
                  : 'var(--neon-purple)'
              }`,
              boxShadow: `0 8px 32px 0 rgba(0,0,0,0.5)`,
              color: '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px' }}>
              <div style={{ fontWeight: 'bold', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px' }}>
                <span>{SKILL_DATA[hoveredZone].icon}</span>
                <span>{SKILL_DATA[hoveredZone].name}</span>
              </div>
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '8px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  backgroundColor:
                    hoveredZone === 'esc'
                      ? 'rgba(255,59,59,0.2)'
                      : hoveredZone === 'numbers'
                      ? 'rgba(0,240,255,0.2)'
                      : hoveredZone === 'alphas'
                      ? 'rgba(57,255,20,0.2)'
                      : 'rgba(189,0,255,0.2)',
                  color:
                    hoveredZone === 'esc'
                      ? '#ff5b5b'
                      : hoveredZone === 'numbers'
                      ? 'var(--neon-cyan)'
                      : hoveredZone === 'alphas'
                      ? 'var(--neon-green)'
                      : 'var(--neon-purple)',
                }}
              >
                {SKILL_DATA[hoveredZone].level}
              </span>
            </div>
            <p style={{ color: '#ccd', lineHeight: '1.4', marginBottom: '6px' }}>
              {SKILL_DATA[hoveredZone].desc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#889', fontSize: '10px' }}>
              <span>Experience:</span>
              <strong style={{ color: '#fff' }}>{SKILL_DATA[hoveredZone].years}</strong>
            </div>
          </div>
        </Html>
      )}

      {/* Instructions when not focused or hovered */}
      {!isFocused && !hoveredZone && hoveredBoard && (
        <Html position={[0, -0.1, 0.2]} center distanceFactor={1.2}>
          <div style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.85)', color: 'var(--neon-cyan)', border: '1px solid var(--neon-cyan)', fontSize: '9px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            CLICK TO INSPECT KEYBOARD SKILLS
          </div>
        </Html>
      )}
    </group>
  )
}
