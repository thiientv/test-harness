"use client";

import { useEffect, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useNeuralState } from '../../context/NeuralStateContext';
import { CLUSTER_CENTERS } from '../../utils/mathHelpers';

interface CameraControllerProps {
  controlsRef: React.MutableRefObject<any>;
}

// 3D coordinate spline path settings that match the scroll traversal pipeline
export const TRAJECTORY_POINTS = [
  new THREE.Vector3(0, 8, 25),      // Index 0: Entry core plunging (viewing central sphere)
  CLUSTER_CENTERS.memory,          // Index 1: Traverses to Memory timeline (-12, -4, -10)
  CLUSTER_CENTERS.knowledge,       // Index 2: Travels to Knowledge nodes (15, 6, -15)
  CLUSTER_CENTERS.projects,        // Index 3: Moves through Project architectures (-5, -8, -25)
  CLUSTER_CENTERS.innovation,      // Index 4: Adjusts direction to Innovation Lab (10, -12, -8)
  CLUSTER_CENTERS.contact,         // Index 5: Settles down into Communication router (0, 2, 8)
];

// Target look-at trajectories aligned with focus targets
const LOOK_AT_POINTS = [
  new THREE.Vector3(0, 0, 0),       // Focus on AI core
  CLUSTER_CENTERS.memory.clone().add(new THREE.Vector3(4, 0, 0)), // Look slightly right of memory cluster
  CLUSTER_CENTERS.knowledge.clone().sub(new THREE.Vector3(5, 0, 0)), // Look left to capture knowledge graph
  CLUSTER_CENTERS.projects.clone().add(new THREE.Vector3(0, 2, 3)), // Look slightly up/closer at projects
  CLUSTER_CENTERS.innovation.clone().add(new THREE.Vector3(-2, 0, 1)), // View noise shifts on center
  CLUSTER_CENTERS.contact.clone().sub(new THREE.Vector3(0, 1, 2)), // Focus squarely on contact gateway
];

function damp3(target: THREE.Vector3, dest: THREE.Vector3, lambda: number, dt: number) {
  target.x = THREE.MathUtils.damp(target.x, dest.x, lambda, dt);
  target.y = THREE.MathUtils.damp(target.y, dest.y, lambda, dt);
  target.z = THREE.MathUtils.damp(target.z, dest.z, lambda, dt);
}

export default function CameraController({ controlsRef }: CameraControllerProps) {
  const { activeSectionIndex, scrollPercentage } = useNeuralState();
  const { camera } = useThree();

  // Reference for smooth target damping interpolation
  const currentTargetPos = useRef(new THREE.Vector3().copy(TRAJECTORY_POINTS[0]));
  const currentLookAt = useRef(new THREE.Vector3().copy(LOOK_AT_POINTS[0]));

  // Generate CatmullRom spline traversal trail
  const cameraCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(TRAJECTORY_POINTS, false, 'centripetal');
  }, []);

  const lookAtCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(LOOK_AT_POINTS, false, 'centripetal');
  }, []);

  useFrame((state, delta) => {
    // 1. Calculate spline coordinate based on raw scroll percentage value [0, 100]
    const t = THREE.MathUtils.clamp(scrollPercentage / 100, 0, 1);
    
    // Sample curve coordinates
    const splineCamPos = cameraCurve.getPointAt(t);
    const splineLookAt = lookAtCurve.getPointAt(t);

    // 2. Identify Section Index focus coordinate (adds viewport snapping offset overlays)
    const activeSectionCamPos = TRAJECTORY_POINTS[activeSectionIndex];
    const activeSectionLookAt = LOOK_AT_POINTS[activeSectionIndex];

    // Blend spline position with screen snapping coordinates to maintain clarity
    // when user finishes scroll and stops at a specific scroll section
    const targetCamPos = new THREE.Vector3().lerpVectors(splineCamPos, activeSectionCamPos, 0.45);
    // Add dynamic offset behind index to provide a cool wide 3D space depth
    targetCamPos.z += 6.5;
    targetCamPos.y += 2.0;

    const targetLook = new THREE.Vector3().lerpVectors(splineLookAt, activeSectionLookAt, 0.45);

    // 3. Smoothly damp camera vectors
    damp3(camera.position, targetCamPos, 3.2, delta);
    damp3(currentLookAt.current, targetLook, 3.2, delta);

    // Apply look-at transformation matrix
    camera.lookAt(currentLookAt.current);

    if (controlsRef.current) {
      damp3(controlsRef.current.target, currentLookAt.current, 3.2, delta);
      controlsRef.current.update();
    }
  });

  return null;
}
