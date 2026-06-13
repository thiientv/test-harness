import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TargetView } from '../App'

interface CameraControllerProps {
  currentView: TargetView
  controlsRef: React.MutableRefObject<any>
}

// Coordinate configurations for smooth lerping focus
const VIEW_CONFIGS = {
  home: {
    cameraPos: new THREE.Vector3(5, 4, 8),
    lookAt: new THREE.Vector3(0, 0.5, 0),
  },
  monitor: {
    cameraPos: new THREE.Vector3(0, 1.25, 1.3),
    lookAt: new THREE.Vector3(0, 1.25, -0.4),
  },
  keyboard: {
    cameraPos: new THREE.Vector3(0, 1.5, 0.8),
    lookAt: new THREE.Vector3(0, 0.75, 0.2),
  },
  server: {
    cameraPos: new THREE.Vector3(-1.8, 1.4, 1.4),
    lookAt: new THREE.Vector3(-1.8, 1.0, -0.4),
  },
}

function damp3(target: THREE.Vector3, dest: THREE.Vector3, lambda: number, dt: number) {
  target.x = THREE.MathUtils.damp(target.x, dest.x, lambda, dt)
  target.y = THREE.MathUtils.damp(target.y, dest.y, lambda, dt)
  target.z = THREE.MathUtils.damp(target.z, dest.z, lambda, dt)
}

export default function CameraController({ currentView, controlsRef }: CameraControllerProps) {
  const config = VIEW_CONFIGS[currentView] || VIEW_CONFIGS.home
  const targetPos = config.cameraPos
  const targetLookAt = config.lookAt
  const isTransitioning = useRef(true)

  // If view target shifts, temporarily disable OrbitControls during transition
  useEffect(() => {
    isTransitioning.current = true
    if (controlsRef.current) {
      controlsRef.current.enabled = false
    }
    // Reactivate controls after the transition (900ms)
    const t = setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.enabled = true
      }
      isTransitioning.current = false
    }, 900)
    return () => clearTimeout(t)
  }, [currentView, controlsRef])

  useFrame((state, delta) => {
    if (!isTransitioning.current) return

    // 1. Interpolate position smoothly (frame-rate independent)
    damp3(state.camera.position, targetPos, 4.0, delta)

    // 2. Interpolate controls focus target point
    if (controlsRef.current) {
      damp3(controlsRef.current.target, targetLookAt, 4.0, delta)
      controlsRef.current.update()
    }
  })

  return null
}
