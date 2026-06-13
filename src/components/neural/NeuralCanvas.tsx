"use client";

import React, { useRef, useEffect, useTransition } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNeuralState } from '../../context/NeuralStateContext';
import NeuralNodes from './NeuralNodes';
import NeuralLines from './NeuralLines';
import CameraController from './CameraController';
import * as THREE from 'three';

export default function NeuralCanvas() {
  const { performanceQuality } = useNeuralState();
  const controlsRef = useRef<any>(null);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#010103] -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 8, 25], fov: 60, near: 0.1, far: 1000 }}
        gl={{
          antialias: performanceQuality === 'high',
          alpha: false,
          powerPreference: "high-performance",
          logarithmicDepthBuffer: false
        }}
        dpr={performanceQuality === 'high' ? [1, 2] : 1}
      >
        <color attach="background" args={['#010103']} />
        
        {/* Soft atmospheric ambient light */}
        <ambientLight intensity={0.4} />
        
        {/* Volumetric direct lighting pointing towards center core */}
        <directionalLight position={[10, 10, 10]} intensity={0.8} color="#00f0ff" />
        <directionalLight position={[-10, -10, -10]} intensity={0.4} color="#bd00ff" />
        
        {/* Point light to highlight central neural network node */}
        <pointLight position={[0, 0, 0]} intensity={1.5} distance={30} color="#ffffff" />

        {/* Instanced Mesh Nodes */}
        <NeuralNodes />

        {/* Glowing synapic lines */}
        <NeuralLines />

        {/* Scroll timeline camera controller */}
        <CameraController controlsRef={controlsRef} />
      </Canvas>

      {/* Atmospheric dark vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,#010103_95%)]" />
    </div>
  );
}
