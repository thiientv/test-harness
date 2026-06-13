import * as THREE from 'three';

export interface NeuralNode {
  id: string;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  size: number;
  category: 'core' | 'memory' | 'knowledge' | 'projects' | 'innovation' | 'contact';
  label: string;
  skillValue?: number; // 0 - 1 scale denoting experience/expertise weight
  description?: string;
}

export interface SynapticPathway {
  fromId: string;
  toId: string;
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  speed: number;
  intensity: number;
}

export interface MemoryMilestone {
  year: string;
  role: string;
  company: string;
  description: string;
  achievements: string[];
  nodeId: string;
}

export interface SkillNode {
  name: string;
  level: number; // For size weighting
  category: string;
  metrics: string;
}

export interface ProjectData {
  title: string;
  client: string;
  role: string;
  description: string;
  techStack: string[];
  metrics: string[];
  architectureLog: string[];
  nodeId: string;
}

export interface DecisionNode {
  question: string;
  yesRoute: string; // ID of the next Node
  noRoute: string;
  description: string;
}
