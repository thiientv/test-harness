import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as THREE from 'three';
import { NeuralNode, SynapticPathway } from '../types/neural';

// Tailwind CSS class name merger helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cluster center coordinates
export const CLUSTER_CENTERS = {
  core: new THREE.Vector3(0, 0, 0),
  memory: new THREE.Vector3(-12, -4, -10),
  knowledge: new THREE.Vector3(15, 6, -15),
  projects: new THREE.Vector3(-5, -8, -25),
  innovation: new THREE.Vector3(10, -12, -8),
  contact: new THREE.Vector3(0, 2, 8),
};

/**
 * Generates spherical coordinates distributed evenly or randomly around a center
 */
export function generateSphericalPosition(
  index: number,
  total: number,
  radius: number,
  centerX: number = 0,
  centerY: number = 0,
  centerZ: number = 0
): THREE.Vector3 {
  // Golden ratio spherical distribution for clean separation
  const phi = Math.acos(1 - 2 * (index + 0.5) / total);
  const theta = Math.PI * (1 + 5 ** 0.5) * index;

  const x = radius * Math.sin(phi) * Math.cos(theta) + centerX;
  const y = radius * Math.sin(phi) * Math.sin(theta) + centerY;
  const z = radius * Math.cos(phi) + centerZ;

  return new THREE.Vector3(x, y, z);
}

/**
 * Generates complete neural network nodes and their connection pathways
 */
export function generateNeuralNetwork(): { nodes: NeuralNode[]; pathways: SynapticPathway[] } {
  const nodes: NeuralNode[] = [];
  const pathways: SynapticPathway[] = [];

  // Helper to add nodes
  const addClusterNodes = (
    category: NeuralNode['category'],
    total: number,
    radius: number,
    center: THREE.Vector3,
    labels: string[],
    descriptions?: string[],
    skillValues?: number[]
  ) => {
    const startIdx = nodes.length;
    for (let i = 0; i < total; i++) {
      const pos = generateSphericalPosition(i, total, radius, center.x, center.y, center.z);
      const id = `${category}-${i}`;
      nodes.push({
        id,
        position: pos.clone(),
        targetPosition: pos.clone(),
        size: category === 'core' ? 0.3 + Math.random() * 0.4 : 0.4 + (skillValues?.[i] || 0.3) * 0.8,
        category,
        label: labels[i] || `${category.toUpperCase()} Node ${i}`,
        description: descriptions?.[i] || '',
        skillValue: skillValues?.[i],
      });
    }

    // Connect node pathways within cluster
    const clusterNodes = nodes.slice(startIdx);
    for (let i = 0; i < clusterNodes.length; i++) {
      // Connect to neighbors (1 or 2 connections)
      const neighborsCount = Math.min(3, clusterNodes.length - 1);
      for (let n = 1; n <= neighborsCount; n++) {
        const nextIdx = (i + n) % clusterNodes.length;
        if (i !== nextIdx) {
          pathways.push({
            fromId: clusterNodes[i].id,
            toId: clusterNodes[nextIdx].id,
            fromPos: clusterNodes[i].position,
            toPos: clusterNodes[nextIdx].position,
            speed: 0.5 + Math.random() * 1.5,
            intensity: 0.4 + Math.random() * 0.6,
          });
        }
      }
    }
  };

  // 1. Core nodes (representing internal brain processes)
  const coreLabels = Array.from({ length: 25 }, (_, i) => `AI Core Subunit ${i + 1}`);
  addClusterNodes('core', 25, 4.5, CLUSTER_CENTERS.core, coreLabels);

  // 2. Memory milestones
  const memoryLabels = [
    'Cloud Architect - Tech Leader',
    'Senior DevOps Engineer',
    'Platform Architect',
    'Software Engineer',
    'System Administrator'
  ];
  const memoryDescriptions = [
    'Leading cloud architecture & orchestration migrations at enterprise scale.',
    'Engineered high throughput CI/CD and self-healing Kubernetes clusters.',
    'Designed multi-tenant platform infrastructure and service meshes.',
    'Developed core microservices using Go, Node, and Python.',
    'Managed physical networks, security guardrails, and bare metal servers.'
  ];
  addClusterNodes('memory', memoryLabels.length, 3.5, CLUSTER_CENTERS.memory, memoryLabels, memoryDescriptions);

  // 3. Knowledge/Skills
  const knowledgeLabels = [
    'Kubernetes / Docker', 'AWS / GCP / Azure', 'Terraform / OpenTofu', 'Python / Go',
    'CI/CD Pipelines', 'Prometheus & Grafana', 'Generative AI / LLMs', 'Linux / Kernel tuning',
    'Service Mesh (Istio)', 'PostgreSQL / Redis', 'GitOps (ArgoCD)', 'Network Security'
  ];
  const knowledgeSkills = [0.95, 0.9, 0.9, 0.85, 0.88, 0.8, 0.75, 0.85, 0.8, 0.82, 0.85, 0.78];
  addClusterNodes('knowledge', knowledgeLabels.length, 4.0, CLUSTER_CENTERS.knowledge, knowledgeLabels, undefined, knowledgeSkills);

  // 4. Projects
  const projectLabels = ['System Cortex', 'Data Pipeline Synapse', 'Secure Gatekeeper v2', 'Autonomous Deployer'];
  const projectDescriptions = [
    'Zero-trust AI microservice mesh with real-time anomaly detection.',
    'Multi-region stream pipeline handling 100k events/sec with Apache Kafka & Flink.',
    'Global identity federator and policy engine with OAuth2 and OAuth WebAuthn.',
    'Kubernetes controller automating canary rollouts using Prometheus traffic metrics.'
  ];
  addClusterNodes('projects', projectLabels.length, 3.0, CLUSTER_CENTERS.projects, projectLabels, projectDescriptions);

  // 5. Innovation Lab
  const innovationLabels = ['Evolving Brain Shader', 'Simplex Noise Physics', 'Autonomous Agent Agentic Orchestrator', 'Synaptic Database Interface'];
  addClusterNodes('innovation', innovationLabels.length, 3.2, CLUSTER_CENTERS.innovation, innovationLabels);

  // 6. Contact/Communication
  const contactLabels = ['Message Router', 'E-mail Handshake', 'Resume Downloader', 'Secure Connection Gateway'];
  addClusterNodes('contact', contactLabels.length, 2.5, CLUSTER_CENTERS.contact, contactLabels);

  // Connect clusters together with high-speed pathways to show core integration
  const categories: NeuralNode['category'][] = ['memory', 'knowledge', 'projects', 'innovation', 'contact'];
  categories.forEach((cat) => {
    // Find one random node from the cluster and connect it to a central core node
    const catNodes = nodes.filter(n => n.category === cat);
    const coreNodes = nodes.filter(n => n.category === 'core');
    if (catNodes.length > 0 && coreNodes.length > 0) {
      const nodeA = catNodes[0];
      const nodeB = coreNodes[Math.floor(Math.random() * coreNodes.length)];
      pathways.push({
        fromId: nodeA.id,
        toId: nodeB.id,
        fromPos: nodeA.position,
        toPos: nodeB.position,
        speed: 2.5,
        intensity: 1.0,
      });
    }
  });

  return { nodes, pathways };
}

/**
 * Procedural generation of a 3D spline point given a progress percentage [0, 1]
 * along multiple CatmullRomCurve3 path definitions.
 */
export function sampleSplinePosition(
  curve: THREE.CatmullRomCurve3,
  t: number
): THREE.Vector3 {
  return curve.getPointAt(Math.max(0, Math.min(1, t)));
}

/**
 * Simple 1D Pseudo-random Simplex Noise Approximation for smooth vertex shifting
 */
export function pseudoNoise(x: number, y: number, z: number, time: number): number {
  const sinValue = Math.sin(x * 12.9898 + y * 78.233 + z * 43.123 + time) * 43758.5453;
  return sinValue - Math.floor(sinValue);
}

/**
 * Linearly interpolates between two vectors
 */
export function lerpVector(v1: THREE.Vector3, v2: THREE.Vector3, alpha: number): THREE.Vector3 {
  return new THREE.Vector3().lerpVectors(v1, v2, alpha);
}
