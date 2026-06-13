"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNeuralState } from '../../context/NeuralStateContext';
import { LINE_SHADER } from './shaders';

interface LineData {
  positions: Float32Array;
  progress: Float32Array;
}

export default function NeuralLines() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { pathways } = useNeuralState();

  // Draw lines as custom buffers to feed vertex array attributes
  // representing lines with custom progress coordinates which are used by GLSL
  const lineBuffers = useMemo(() => {
    // Generate arrays mapping segments (fromPos, toPos pairs)
    const positionsList: number[] = [];
    const progressList: number[] = [];

    pathways.forEach((path) => {
      // Line starts at fromPos, ends at toPos
      positionsList.push(
        path.fromPos.x, path.fromPos.y, path.fromPos.z,
        path.toPos.x, path.toPos.y, path.toPos.z
      );

      // Map progress coords along the line
      // fromPos is 0.0, toPos is 1.0
      progressList.push(0.0, 1.0);
    });

    return {
      positions: new Float32Array(positionsList),
      progress: new Float32Array(progressList),
    };
  }, [pathways]);

  // Set line uniforms for custom GLSL dashboard shaders
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color('#00f0ff') },
    uTime: { value: 0 },
    uIntensity: { value: 0.8 },
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  if (pathways.length === 0) return null;

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[lineBuffers.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aProgress"
          args={[lineBuffers.progress, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={LINE_SHADER.vertexShader}
        fragmentShader={LINE_SHADER.fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
