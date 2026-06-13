"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { NeuralNode, SynapticPathway } from '../types/neural';
import { generateNeuralNetwork } from '../utils/math-helpers';

interface NeuralStateContextType {
  activeSectionIndex: number;
  setActiveSectionIndex: (index: number) => void;
  hoveredNodeId: string | null;
  setHoveredNodeId: (id: string | null) => void;
  selectedProjectIndex: number | null;
  setSelectedProjectIndex: (index: number | null) => void;
  scrollPercentage: number;
  setScrollPercentage: (pct: number) => void;
  performanceQuality: 'high' | 'low';
  setPerformanceQuality: (quality: 'high' | 'low') => void;
  nodes: NeuralNode[];
  setNodes: React.Dispatch<React.SetStateAction<NeuralNode[]>>;
  pathways: SynapticPathway[];
  setPathways: React.Dispatch<React.SetStateAction<SynapticPathway[]>>;
}

const NeuralStateContext = createContext<NeuralStateContextType | undefined>(undefined);

export const NeuralStateProvider = ({ 
  children, 
  initialNodes = [], 
  initialPathways = [] 
}: { 
  children: ReactNode; 
  initialNodes?: NeuralNode[]; 
  initialPathways?: SynapticPathway[];
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const [performanceQuality, setPerformanceQuality] = useState<'high' | 'low'>('high');
  const [nodes, setNodes] = useState<NeuralNode[]>(initialNodes);
  const [pathways, setPathways] = useState<SynapticPathway[]>(initialPathways);

  // Initialize nodes and pathways if empty
  useEffect(() => {
    if (nodes.length === 0 || pathways.length === 0) {
      const { nodes: genNodes, pathways: genPathways } = generateNeuralNetwork();
      setNodes(genNodes);
      setPathways(genPathways);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NeuralStateContext.Provider
      value={{
        activeSectionIndex,
        setActiveSectionIndex,
        hoveredNodeId,
        setHoveredNodeId,
        selectedProjectIndex,
        setSelectedProjectIndex,
        scrollPercentage,
        setScrollPercentage,
        performanceQuality,
        setPerformanceQuality,
        nodes,
        setNodes,
        pathways,
        setPathways,
      }}
    >
      {children}
    </NeuralStateContext.Provider>
  );
};

export const useNeuralState = () => {
  const context = useContext(NeuralStateContext);
  if (!context) {
    throw new Error('useNeuralState must be used within a NeuralStateProvider');
  }
  return context;
};
