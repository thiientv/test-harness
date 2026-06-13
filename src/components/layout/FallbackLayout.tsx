import React from 'react';
import { Send, Cloud, Cpu, Server, Shield, Radio, Terminal, Award } from 'lucide-react';

export default function FallbackLayout() {
  return (
    <div className="min-h-screen bg-[#010103] text-white selection:bg-cyan-500/30 py-16 px-6 md:px-16 max-w-6xl mx-auto">
      {/* 2D Fallback Hero Screen */}
      <header className="mb-20 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6">
          <Cpu className="w-3.5 h-3.5" />
          SYSTEM RESOLVED IN 2D CORE LAYOUT
        </div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6">
          SYSTEM PORTFOLIO
        </h1>
        <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl leading-relaxed">
          WebGL hardware acceleration is unavailable on this device. Explore the system specs, career milestones, and engineering methodologies using this modern 2D database layout.
        </p>
      </header>

      {/* Main Content Sections Grid */}
      <main className="space-y-24">
        {/* Section 1: Professional Experience */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 border-b border-purple-500/20 pb-4">
            <Award className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-purple-400 font-mono">Memory Center</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { year: '2024 - Present', role: 'Staff Platform Architect', company: 'Neural Systems Group', desc: 'Leading kubernetes orchestration multi-region migrations for AI pipeline tooling.' },
              { year: '2021 - 2024', role: 'Senior Cloud Developer', company: 'Global Tech Corp', desc: 'Designed low-latency microservices using Go and integrated EventHub stream pipelines.' },
              { year: '2019 - 2021', role: 'DevOps Specialist', company: 'FinTech Integrators', desc: 'Established container orchestrations and built secure IAC Terraform patterns.' }
            ].map((milestone, idx) => (
              <div key={idx} className="p-6 rounded-lg bg-purple-950/10 border border-purple-900/20">
                <span className="text-purple-400 font-mono text-sm font-semibold">{milestone.year}</span>
                <h3 className="text-lg font-bold mt-2 text-white">{milestone.role}</h3>
                <span className="text-sm text-slate-400 block mb-4">{milestone.company}</span>
                <p className="text-sm text-slate-300 leading-relaxed font-light">{milestone.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Skills and Expertise */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-4">
            <Cloud className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-cyan-400 font-mono">Knowledge Network</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Cloud Systems API', skills: ['Kubernetes', 'Terraform', 'Vault / IAM', 'AWS / GCP Mesh'], icon: Server },
              { title: 'Software Engineering', skills: ['Go / Python / Rust', 'gRPC / GraphQL', 'Kafka Streaming', 'FastAPI Microservices'], icon: Cpu },
              { title: 'Telemetry & GitOps', skills: ['Prometheus Stack', 'OpenTelemetry', 'ArgoCD / Helm', 'GitHub Actions'], icon: Radio },
              { title: 'Security Defenses', skills: ['Network Policies', 'OIDC Federated OAuth', 'TLS Encryption', 'Secrets Injection'], icon: Shield }
            ].map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <div key={idx} className="p-6 rounded-lg bg-black/40 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <IconComp className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">{cat.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Architecture Projects */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Terminal className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-indigo-400 font-mono">Project Cortex</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'CortexMesh Engine', metrics: 'Avg Latency: 4.8ms • Zero-Trust SSL', desc: 'Secure communication mesh featuring AI anomalistic detection. Handled network routing rules autonomously within cluster structures.' },
              { title: 'DataFlow Synapse', metrics: 'Throughput: 120k eps • Stream Pipeline', desc: 'Multi-region streaming ingestion engine utilizing Apache Kafka clusters. Connected streaming topics to real-time analysis tools.' }
            ].map((proj, idx) => (
              <div key={idx} className="p-6 rounded-lg bg-indigo-950/15 border border-indigo-900/30">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-white text-xl">{proj.title}</h3>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {proj.metrics}
                  </span>
                </div>
                <p className="text-slate-350 leading-relaxed font-light text-sm">{proj.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Email Connection */}
        <section className="max-w-xl mx-auto py-12">
          <div className="p-8 rounded-xl border border-cyan-500/20 bg-cyan-950/5 relative text-center">
            <Send className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Secure Connection</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Submit your inquiry details securely to route a message direct to my mail client.
            </p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="IDENTITY (your email address)" 
                className="w-full bg-black/60 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors duration-300 font-mono"
              />
              <textarea 
                rows={4}
                placeholder="PAYLOAD (write your transmission here)" 
                className="w-full bg-black/60 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors duration-300 font-mono resize-none"
              />
              <button 
                type="submit" 
                className="w-full py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/20 font-bold text-sm tracking-wider uppercase transition-all duration-300"
              >
                Transmit Packet
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
