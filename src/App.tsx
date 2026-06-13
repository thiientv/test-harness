import { useState } from 'react'
import Scene from './components/Scene'
import { Monitor, Keyboard as KeyboardIcon, Server, RotateCcw, HelpCircle, Layers, Cpu } from 'lucide-react'

export type TargetView = 'home' | 'monitor' | 'keyboard' | 'server'

export default function App() {
  const [currentView, setCurrentView] = useState<TargetView>('home')
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: 'var(--bg-color)', overflow: 'hidden' }}>
      
      {/* 3D Canvas Scene */}
      <Scene currentView={currentView} onViewChange={setCurrentView} />

      {/* Top HUD Card */}
      <div className="hud-overlay" style={{ top: 20, left: 20, display: 'flex', gap: 15, alignItems: 'center' }}>
        <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', gap: 15, alignItems: 'center', pointerEvents: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
              NEO-WORKSPACE
            </h1>
            <span style={{ fontSize: '10px', color: '#88a', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
              3D Dev Environment v1.0.0
            </span>
          </div>
        </div>
      </div>

      {/* Floating Mode Status HUD (Top Right) */}
      <div className="hud-overlay" style={{ top: 20, right: 20 }}>
        <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--neon-cyan)', textShadow: '0 0 5px rgba(0, 240, 255, 0.4)', pointerEvents: 'auto' }}>
          <Layers size={16} />
          <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
            STATUS: {currentView.toUpperCase()} VIEW
          </span>
        </div>
      </div>

      {/* Floating Instructions/Control HUD (Bottom Left) */}
      <div className="hud-overlay" style={{ bottom: 20, left: 20, maxWidth: '300px' }}>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--neon-purple)', fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
            <HelpCircle size={16} />
            <span>INTERACTIVE ZONES</span>
          </div>
          <p style={{ fontSize: '11px', color: '#ccd', lineHeight: '1.4' }}>
            Click on any highlighted element in the room to zoom in:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '11px', color: '#aab', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Monitor size={12} color="var(--neon-green)" />
              <span><strong>Monitor Screen</strong>: Dev Terminal Simulator</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <KeyboardIcon size={12} color="var(--neon-cyan)" />
              <span><strong>Mechanical Keyboard</strong>: Skill Matrix Deck</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Server size={12} color="var(--neon-purple)" />
              <span><strong>Server Rack</strong>: Cabinet Project Files</span>
            </div>
          </div>
          <p style={{ fontSize: '10px', color: '#778', marginTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px' }}>
            * Click and drag to orbit camera around when in Home mode.
          </p>
        </div>
      </div>

      {/* View Controller (Bottom Right) */}
      <div className="hud-overlay" style={{ bottom: 20, right: 20, display: 'flex', gap: 10 }}>
        {currentView !== 'home' ? (
          <button className="glow-btn hud-interactive" onClick={() => setCurrentView('home')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RotateCcw size={16} />
            <span>RESET VIEW</span>
          </button>
        ) : (
          <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px', color: '#889', alignItems: 'flex-end' }}>
            <span>SELECT FOCUS TARGET:</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="glow-btn hud-interactive" onClick={() => setCurrentView('monitor')} style={{ padding: '6px 12px', fontSize: '10px' }}>
                TERMINAL
              </button>
              <button className="glow-btn hud-interactive" onClick={() => setCurrentView('keyboard')} style={{ padding: '6px 12px', fontSize: '10px' }}>
                SKILLS
              </button>
              <button className="glow-btn-purple hud-interactive" onClick={() => setCurrentView('server')} style={{ padding: '6px 12px', fontSize: '10px' }}>
                PROJECTS
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Modal HUD (Left/Right overlay panels depending on view state) */}
      {currentView === 'keyboard' && (
        <div className="hud-overlay" style={{ right: 80, top: '25%', width: '360px', transform: 'translateY(-0%)' }}>
          <div className="glass-panel-purple" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--neon-purple)' }}>
              <Cpu size={24} />
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>SKILL DECK ACTIVATED</h2>
            </div>
            <p style={{ fontSize: '13px', color: '#cce', lineHeight: '1.5' }}>
              Hover over key zones on the 3D model mechanical keyboard to load technical specifications for each programming stack.
            </p>
            <div style={{ borderTop: '1px solid rgba(189, 0, 255, 0.2)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '12px', color: '#aab' }}>
              <div>🟢 <strong>ESC/F-Keys</strong> - System Config, Devops & Git</div>
              <div>🔵 <strong>Number Row</strong> - Backend Engines (Node.js, Express, Go)</div>
              <div>🟣 <strong>Alpha Matrix</strong> - Javascript / Typescript / React core</div>
              <div>⚡ <strong>Space/Specials</strong> - 3D Graphics, WebGL, shaders, R3F</div>
            </div>
            <button className="glow-btn-purple hud-interactive" style={{ marginTop: '5px' }} onClick={() => setCurrentView('home')}>
              DISMISS MATRIX
            </button>
          </div>
        </div>
      )}

      {/* Intro Tutorial Overlay */}
      {showIntro && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(5, 5, 10, 0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-panel-purple" style={{ padding: '40px', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20 }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '4px', fontFamily: 'var(--font-mono)' }}>
              WELCOME AGENT
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))' }}></div>
            <p style={{ fontSize: '14px', color: '#ccd', lineHeight: '1.6' }}>
              You are accessing the holographic developer workstation interface. Use the 3D canvas to inspect personal skills, launch simulations from the terminal board, or toggle individual servers inside the server stack to inspect current live builds.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignSelf: 'stretch', textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px', color: '#aab' }}>
              <div style={{ display: 'flex', gap: 10 }}><span>🖱️</span><span><strong>Rotate</strong>: Click + Drag in empty space</span></div>
              <div style={{ display: 'flex', gap: 10 }}><span>🔍</span><span><strong>Zoom</strong>: Mouse Wheel / Scroll</span></div>
              <div style={{ display: 'flex', gap: 10 }}><span>💻</span><span><strong>Interact</strong>: Single Click on desk elements to inspect</span></div>
            </div>
            <button className="glow-btn hud-interactive" onClick={() => setShowIntro(false)} style={{ padding: '12px 30px', marginTop: '10px' }}>
              INITIALIZE INTERFACE
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
