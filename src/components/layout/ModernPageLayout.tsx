"use client";

import React, { useRef, useEffect } from 'react';
import { useNeuralState } from '../../context/NeuralStateContext';
import GlassCard from '../ui/GlassCard';
import { motion } from 'framer-motion';
import { Send, Cloud, Cpu, Server, Shield, Radio, Terminal, Award } from 'lucide-react';

export default function ModernPageLayout() {
  const { activeSectionIndex, setActiveSectionIndex, setScrollPercentage } = useNeuralState();
  const containersRef = useRef<HTMLDivElement>(null);

  // Synchronize CSS scrolling of overlapping viewports to the global WebGL spline progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    if (scrollHeight <= 0) return;
    
    const scrolled = (target.scrollTop / scrollHeight) * 100;
    setScrollPercentage(scrolled);

    // Calculate active section index based on scroll boundary offsets
    const clientHeight = target.clientHeight || 1;
    const sectionIndex = Math.max(0, Math.min(5, Math.floor(target.scrollTop / clientHeight + 0.5)));
    setActiveSectionIndex(sectionIndex);
  };

  return (
    <div 
      ref={containersRef}
      onScroll={handleScroll}
      className="absolute inset-0 w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth z-10"
      style={{ scrollbarWidth: 'thin' }}
    >
      {/* SECTION 0: Artificial Intelligence Core (Hero) */}
      <section className="w-full h-full snap-start flex flex-col items-center justify-center relative px-6 select-none bg-transparent">
        <div className="max-w-4xl text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              LIVING AI CONSCIOUSNESS RENDER
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-6">
              SYSTEM PORTFOLIO
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
              Explore an evolving digital brain representing my cloud systems architecture, Devops automation, and machine learning pipelines.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => {
              if (containersRef.current) {
                containersRef.current.scrollTo({
                  top: containersRef.current.clientHeight,
                  behavior: 'smooth'
                });
              }
            }}
          >
            <span className="text-xs uppercase tracking-widest text-slate-400">Plunge Downward</span>
            <div className="w-1.5 h-6 rounded-full bg-cyan-400/20 relative overflow-hidden">
              <motion.div 
                animate={{ y: [0, 16, 0] }}
                transition={{ repeat: Infinity, duration: 2.0 }}
                className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 1: Memory Center (Timeline) */}
      <section className="w-full h-full snap-start flex items-center justify-start relative px-6 md:px-24 bg-transparent">
        <div className="max-w-3xl w-full">
          <GlassCard variant="purple" isVisible={activeSectionIndex === 1}>
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold uppercase tracking-widest text-purple-400">Memory Center</h2>
            </div>
            <p className="text-slate-300 font-medium text-lg mb-8 leading-relaxed">
              Tracing career trajectories and milestone database fragments stored inside the brain subnetwork.
            </p>

            <div className="space-y-6 relative border-l border-purple-500/30 pl-6 ml-3">
              {[
                { year: '2024 - Present', role: 'Staff Platform Architect', company: 'Neural Systems Group', desc: 'Leading kubernetes orchestration multi-region migrations for AI pipeline tooling.' },
                { year: '2021 - 2024', role: 'Senior Cloud Developer', company: 'Global Tech Corp', desc: 'Designed low-latency microservices using Go and integrated EventHub stream pipelines.' },
                { year: '2019 - 2021', role: 'DevOps Specialist', company: 'FinTech Integrators', desc: 'Established container orchestrations and built secure IAC Terraform patterns.' }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#010103] border-2 border-purple-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:scale-150 transition-all duration-300" />
                  </div>
                  <span className="text-xs font-semibold text-purple-400 tracking-wider font-mono">{item.year}</span>
                  <h3 className="text-lg font-bold text-white mt-1 group-hover:text-purple-300 transition-colors duration-300">{item.role}</h3>
                  <span className="text-sm text-slate-400 font-medium">{item.company}</span>
                  <p className="text-sm text-slate-300 mt-2 font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* SECTION 2: Knowledge Network */}
      <section className="w-full h-full snap-start flex items-center justify-end relative px-6 md:px-24 bg-transparent">
        <div className="max-w-3xl w-full">
          <GlassCard variant="cyan" isVisible={activeSectionIndex === 2}>
            <div className="flex items-center gap-2 mb-6">
              <Cloud className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold uppercase tracking-widest text-cyan-400">Knowledge Network</h2>
            </div>
            <p className="text-slate-300 font-medium text-lg mb-8 leading-relaxed">
              Evaluating skill density nodes inside the network. Signal node sizes scale in direct proportion to target engineering expertises.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { title: 'Cloud Systems API', skills: ['Kubernetes', 'Terraform', 'Vault / IAM', 'AWS / GCP Mesh'], icon: Server },
                { title: 'Software Engineering', skills: ['Go / Python / Rust', 'gRPC / GraphQL', 'Kafka Streaming', 'FastAPI Microservices'], icon: Cpu },
                { title: 'Telemetry & GitOps', skills: ['Prometheus Stack', 'OpenTelemetry', 'ArgoCD / Helm', 'GitHub Actions'], icon: Radio },
                { title: 'Security Defenses', skills: ['Network Policies', 'OIDC Federated OAuth', 'TLS Encryption', 'Secrets Injection'], icon: Shield }
              ].map((cat, idx) => {
                const IconComp = cat.icon;
                return (
                  <div key={idx} className="p-4 rounded-lg bg-black/40 border border-slate-800/60 hover:border-cyan-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-2 mb-3">
                      <IconComp className="w-4 h-4 text-cyan-400 group-hover:animate-bounce" />
                      <h4 className="text-sm font-bold text-white/90 uppercase tracking-wider">{cat.title}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="text-xs px-2 py-0.5 rounded bg-slate-800/40 text-slate-300 font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* SECTION 3: Project Cortex */}
      <section className="w-full h-full snap-start flex items-center justify-start relative px-6 md:px-24 bg-transparent">
        <div className="max-w-3xl w-full">
          <GlassCard variant="default" isVisible={activeSectionIndex === 3}>
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-bold uppercase tracking-widest text-indigo-400">Project Cortex</h2>
            </div>
            <p className="text-slate-300 font-medium text-lg mb-8 leading-relaxed">
              Explore dynamic project nodes representing production structures. Click on active thought nodes to trace system data flow simulations.
            </p>

            <div className="space-y-4">
              {[
                { title: 'CortexMesh Engine', metrics: 'Avg Latency: 4.8ms • Zero-Trust SSL', desc: 'Secure communication mesh featuring AI anomalistic detection.' },
                { title: 'DataFlow Synapse', metrics: 'Throughput: 120k eps • Stream Pipeline', desc: 'Multi-region streaming ingestion engine utilizing Apache Kafka clusters.' }
              ].map((proj, idx) => (
                <div key={idx} className="p-5 rounded-lg bg-indigo-950/10 border border-indigo-900/20 hover:border-indigo-500/40 cursor-pointer transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-white text-lg">{proj.title}</h3>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {proj.metrics}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 font-light">{proj.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* SECTION 4: Innovation Lab */}
      <section className="w-full h-full snap-start flex items-center justify-end relative px-6 md:px-24 bg-transparent">
        <div className="max-w-3xl w-full">
          <GlassCard variant="purple" isVisible={activeSectionIndex === 4}>
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold uppercase tracking-widest text-purple-400">Innovation Lab</h2>
            </div>
            <p className="text-slate-300 font-medium text-lg mb-6 leading-relaxed">
              Visualizing engineering heuristics and experimental neural patterns shifting dynamically under Simplex noise simulations.
            </p>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              <div className="p-3 bg-black/55 border border-purple-500/20 rounded">
                <span className="text-purple-400"># System Optimization Simulation:</span>
                <p className="mt-1 text-emerald-400 font-bold">$ bin/run-simulation --nodes=1500 --threads=32</p>
                <p className="mt-1 text-slate-400">Initializing shader displacement matrices... [OK]</p>
                <p className="text-slate-400">Evaluating multi-threaded neural path calculations... [60 FPS STABLE]</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* SECTION 5: Contact Connection Gateway */}
      <section className="w-full h-full snap-start flex items-center justify-center relative px-6 bg-transparent">
        <div className="max-w-xl w-full">
          <GlassCard variant="cyan" isVisible={activeSectionIndex === 5}>
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Send className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold uppercase tracking-widest text-cyan-400 text-center">Neural Gateway</h2>
            </div>
            <p className="text-slate-300 text-center text-sm mb-6 leading-relaxed">
              Inject a packet message directly into the network. Form submission fires particle waves directly down the network synapses to my target socket.
            </p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input 
                  type="email" 
                  placeholder="IDENTITY (your email address)" 
                  className="w-full bg-black/60 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors duration-300 font-mono"
                />
              </div>
              <div>
                <textarea 
                  rows={4}
                  placeholder="PAYLOAD (write your transmission here)" 
                  className="w-full bg-black/60 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors duration-300 font-mono resize-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2"
              >
                Transmit Packet
                <Send className="w-4 h-4" />
              </button>
            </form>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
