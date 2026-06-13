import Monitor from './Monitor'
import Keyboard from './Keyboard'
import ServerRack from './ServerRack'
import { TargetView } from '../App'

interface DeskSetupProps {
  currentView: TargetView
  onViewChange: (view: TargetView) => void
}

export default function DeskSetup({ currentView, onViewChange }: DeskSetupProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Tabletop */}
      <mesh position={[0, 0.7, 0]} receiveShadow castShadow>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial color="#111116" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* 2. Desk Legs (4 Legs) */}
      <mesh position={[-1.9, 0.35, -0.9]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.7]} />
        <meshStandardMaterial color="#0b0b0d" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.9, 0.35, -0.9]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.7]} />
        <meshStandardMaterial color="#0b0b0d" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-1.9, 0.35, 0.9]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.7]} />
        <meshStandardMaterial color="#0b0b0d" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.9, 0.35, 0.9]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.7]} />
        <meshStandardMaterial color="#0b0b0d" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 3. Desk Matte Drawer Unit / Cable Organizer */}
      <mesh position={[0, 0.6, -0.8]}>
        <boxGeometry args={[1.5, 0.1, 0.3]} />
        <meshStandardMaterial color="#0f0f13" roughness={0.8} />
      </mesh>

      {/* 4. Ambient desk LED light strips behind the desk */}
      <mesh position={[0, 0.76, -0.98]}>
        <boxGeometry args={[3.8, 0.02, 0.01]} />
        <meshBasicMaterial color="var(--neon-purple)" />
      </mesh>
      <pointLight position={[0, 0.8, -1]} intensity={0.8} distance={2} color="var(--neon-purple)" />

      {/* 5. Desk Accessories / Coffee Mug */}
      <mesh position={[1.6, 0.81, 0.5]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.12]} />
        <meshStandardMaterial color="#1a0033" roughness={0.1} metalness={0.1} />
      </mesh>
      
      {/* 6. Interactive Monitor Component */}
      <Monitor currentView={currentView} onViewChange={onViewChange} />

      {/* 7. Interactive Mechanical Keyboard */}
      <Keyboard currentView={currentView} onViewChange={onViewChange} />

      {/* 8. Interactive Server Rack */}
      <ServerRack currentView={currentView} onViewChange={onViewChange} />
    </group>
  )
}
