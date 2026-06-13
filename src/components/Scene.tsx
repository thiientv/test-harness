import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import GridFloor from './GridFloor'
import DeskSetup from './DeskSetup'
import CameraController from './CameraController'
import { TargetView } from '../App'
import { NEON_THEME } from '../constants/theme'

interface SceneProps {
  currentView: TargetView
  onViewChange: (view: TargetView) => void
}

export default function Scene({ currentView, onViewChange }: SceneProps) {
  const controlsRef = useRef<any>(null)

  return (
    <Canvas
      camera={{ position: [5, 4, 8], fov: 50 }}
      shadows
      style={{ width: '100vw', height: '100vh', background: '#020205' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color={NEON_THEME.cyan} />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color={NEON_THEME.purple} />
      
      {/* Dynamic Key Lighting to highlight Tabletop */}
      <spotLight
        position={[0, 10, 2]}
        angle={0.6}
        penumbra={0.5}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#ffffff"
      />

      {/* Cyberpunk Environment Stars */}
      <Stars radius={100} depth={50} count={1200} factor={4} saturation={0.5} fade speed={1} />
      
      <color attach="background" args={['#020205']} />

      {/* Grid Floor */}
      <GridFloor />

      {/* Desk and Interactive Models */}
      <DeskSetup currentView={currentView} onViewChange={onViewChange} />

      {/* Camera Interp Controller */}
      <CameraController currentView={currentView} controlsRef={controlsRef} />

      {/* User Navigation OrbitControls */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2 - 0.05} // prevent going fully under index floor
        minDistance={1.5}
        maxDistance={15}
        // If focusing, disable controls temporarily or let them lerp then regain control
        makeDefault
      />
    </Canvas>
  )
}
