"use client";

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useNeuralState } from '../../context/NeuralStateContext';
import { NODE_SHADER } from './shaders';

const tempObject = new THREE.Object3D();
const mouseWorldPos = new THREE.Vector3();

export default function NeuralNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const { nodes, setHoveredNodeId, hoveredNodeId, activeSectionIndex } = useNeuralState();
  const { pointer, camera, raycaster } = useThree();

  // Create memoized shader uniforms
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color('#00f0ff') },
    uTime: { value: 0 },
    uHover: { value: 0.0 }, // generic hover value
    uPulseFreq: { value: 2.0 }
  }), []);

  // Update instanced matrices when nodes are loaded/updated
  useEffect(() => {
    if (!meshRef.current || nodes.length === 0) return;
    
    nodes.forEach((node, i) => {
      tempObject.position.copy(node.position);
      tempObject.scale.setScalar(node.size);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  // Frame routing loops
  useFrame((state, delta) => {
    if (!meshRef.current || nodes.length === 0) return;

    const time = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
    }

    // Convert pointer screen coords to 3D plane projection in front of camera
    // to simulate standard mouse push/pull physics
    mouseWorldPos.set(pointer.x, pointer.y, 0.5).unproject(camera);
    const dir = mouseWorldPos.clone().sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z; // project onto z=0 plane mostly
    const mousePos3D = camera.position.clone().add(dir.multiplyScalar(distance));

    // Dynamic node scale and displacement lerps
    nodes.forEach((node, i) => {
      const nodePos = node.position.clone();
      
      // Cursor repulsion effect
      const distToMouse = nodePos.distanceTo(mousePos3D);
      const repelThreshold = 4.0;
      if (distToMouse < repelThreshold) {
        const repelForce = (1.0 - distToMouse / repelThreshold) * 1.2;
        const repelDir = nodePos.clone().sub(mousePos3D).normalize();
        repelDir.y *= 0.5; // less vertical stretch
        node.targetPosition.copy(node.position).add(repelDir.multiplyScalar(repelForce));
      } else {
        node.targetPosition.copy(node.position);
      }

      // Smoothly slide current node position to target position
      const currentPos = new THREE.Vector3();
      const currentMatrix = new THREE.Matrix4();
      meshRef.current!.getMatrixAt(i, currentMatrix);
      currentPos.setFromMatrixPosition(currentMatrix);

      // Lerp position
      currentPos.lerp(node.targetPosition, 6.0 * delta);

      // Math node scaling based on status (hovered, active category size weight)
      const isHovered = hoveredNodeId === node.id;
      const isSameCategory = node.category === getCategoryFromIndex(activeSectionIndex);

      let targetScale = node.size;
      if (isHovered) {
        targetScale = node.size * 1.8;
      } else if (isSameCategory) {
        targetScale = node.size * 1.35;
      }

      // Read current scale using matrix decomposition
      const scale = new THREE.Vector3();
      const rotation = new THREE.Quaternion();
      currentMatrix.decompose(new THREE.Vector3(), rotation, scale);
      
      const currentScale = scale.x;
      // Damped scale interpolation
      const nextScale = THREE.MathUtils.damp(currentScale, targetScale, 8.0, delta);

      // Update transform matrix
      tempObject.position.copy(currentPos);
      tempObject.scale.setScalar(nextScale);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Handle pointer interactions using R3F event triggers
  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    if (e.instanceId !== undefined && nodes[e.instanceId]) {
      setHoveredNodeId(nodes[e.instanceId].id);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHoveredNodeId(null);
    document.body.style.cursor = 'default';
  };

  // Maps active state index coordinates back to category labels
  const getCategoryFromIndex = (index: number): string => {
    switch (index) {
      case 0: return 'core';
      case 1: return 'memory';
      case 2: return 'knowledge';
      case 3: return 'projects';
      case 4: return 'innovation';
      case 5: return 'contact';
      default: return 'core';
    }
  };

  // Resolve color dynamically based on node category
  const getNodeColor = (category: string): THREE.Color => {
    switch (category) {
      case 'core': return new THREE.Color('#00f0ff');       // Cyan
      case 'memory': return new THREE.Color('#bd00ff');     // Purple/Magenta
      case 'knowledge': return new THREE.Color('#39ff14');  // Neon Green
      case 'projects': return new THREE.Color('#00f0ff');   // Cyan
      case 'innovation': return new THREE.Color('#ffffff'); // Pure White
      case 'contact': return new THREE.Color('#bd00ff');    // Purple
      default: return new THREE.Color('#00f0ff');
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[new THREE.SphereGeometry(1, 16, 16), null as any, nodes.length]}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={NODE_SHADER.vertexShader}
        fragmentShader={NODE_SHADER.fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
