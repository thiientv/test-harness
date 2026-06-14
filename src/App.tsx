import { useState, useEffect, useRef } from 'react';
import { Menu, X, Compass, Layers, Globe } from 'lucide-react';

export interface ImageConfig {
  id: string;
  url: string;
  title: string;
  description: string;
}

export const IMAGES: ImageConfig[] = [
  {
    id: 'base',
    url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=2400',
    title: 'Lithospheric Crust',
    description: 'The rigid, weathered outer shell of Earth, preserving millions of years of surface tectonic history.'
  },
  {
    id: 'sediment',
    url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=2400',
    title: 'Sedimentary Stratification',
    description: 'Exposed mineral bands revealing ancient compressed marine layers and chronological rock deposition.'
  }
];

export const LithosLogo = () => (
  <svg
    className="w-8 h-8 text-amber-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    data-testid="lithos-logo"
  >
    <polygon points="12 2 2 22 22 22" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="22" x2="12" y2="12" />
    <line x1="22" y1="22" x2="12" y2="12" />
  </svg>
);

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [maskDataUrl, setMaskDataUrl] = useState<string>('');
  
  // Use state to trigger canvas-based DOM re-evaluation when active Index changes (if we had tabs)
  const [activeIndex, setActiveIndex] = useState(0);

  // Spotlight coordinates state
  const targetCoords = useRef({ x: 0, y: 0 });
  const currentCoords = useRef({ x: 0, y: 0 });
  const isMouseInWindow = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize target coordinates to the center of the window once mounted
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    targetCoords.current = { x: width / 2, y: height / 2 };
    currentCoords.current = { x: width / 2, y: height / 2 };
    
    // Draw initial spotlight center
    updateMask(width / 2, height / 2);
  }, []);

  // Update/draw function for canvas gradient & mask DataURL
  const updateMask = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear previous canvas
      ctx.clearRect(0, 0, width, height);

      // Create high contrast spotlight circle
      // Outer mask requirements: transparent (alpha = 0) hides image, opaque (alpha = 1) reveals it
      const spotlightRadius = Math.max(160, Math.min(window.innerWidth * 0.15, 260));
      
      const gradient = ctx.createRadialGradient(
        x, y, 0, 
        x, y, spotlightRadius
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.7)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, spotlightRadius, 0, Math.PI * 2);
      ctx.fill();

      const url = canvas.toDataURL();
      setMaskDataUrl(url);
    } catch (err) {
      console.warn("Failed to generate mask data URL", err);
    }
  };

  // Canvas size sync
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // If mouse is not in screen, keep spotlight centered
      if (!isMouseInWindow.current) {
        targetCoords.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Mouse move and frame loop logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetCoords.current = { x: e.clientX, y: e.clientY };
      isMouseInWindow.current = true;
    };

    const handleMouseLeave = () => {
      // Gently return spotlight to screen center when cursor leaves
      targetCoords.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      isMouseInWindow.current = false;
    };

    const handleMouseEnter = (e: MouseEvent) => {
      isMouseInWindow.current = true;
      targetCoords.current = { x: e.clientX, y: e.clientY };
      currentCoords.current = { x: e.clientX, y: e.clientY };
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mouseenter', handleMouseEnter);
    }

    let animationFrameId: number;

    const tick = () => {
      const dx = targetCoords.current.x - currentCoords.current.x;
      const dy = targetCoords.current.y - currentCoords.current.y;

      // Only perform costly canvas drawing & state update if coordinates haven't fully settled
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        currentCoords.current.x += dx * 0.1; // Smooth 0.1 easing (lerping)
        currentCoords.current.y += dy * 0.1;
        updateMask(currentCoords.current.x, currentCoords.current.y);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mouseenter', handleMouseEnter);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[100dvh] overflow-hidden bg-neutral-950 font-sans text-neutral-200 select-none flex flex-col justify-between"
      style={{ contentVisibility: 'auto' }}
      data-active-index={activeIndex}
    >
      {/* Hidden processing canvas to generate mask */}
      <canvas 
        ref={canvasRef} 
        className="hidden" 
        style={{ display: 'none' }}
      />

      {/* Layer 1: Base Landscape Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center animate-hero-zoom transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${IMAGES[0].url})`,
        }}
      />

      {/* Dark tint overlay for ambient atmosphere */}
      <div className="absolute inset-0 bg-neutral-950/80 pointer-events-none mix-blend-multiply" />

      {/* Layer 2: Sediment Reveal Spotlight Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none mask-layer transition-all duration-150 ease-out"
        style={{ 
          backgroundImage: `url(${IMAGES[1].url})`,
          maskImage: maskDataUrl ? `url(${maskDataUrl})` : 'none',
          WebkitMaskImage: maskDataUrl ? `url(${maskDataUrl})` : 'none',
        }}
      />

      {/* Spotlight Halo visual enhancement (glowing border cursor guide) */}
      <div 
        className="absolute pointer-events-none rounded-full border border-amber-500/20 mix-blend-screen shadow-[0_0_60px_rgba(245,158,11,0.15)] transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${currentCoords.current.x}px`,
          top: `${currentCoords.current.y}px`,
          width: `${Math.max(160, Math.min(window.innerWidth * 0.15, 260)) * 2}px`,
          height: `${Math.max(160, Math.min(window.innerWidth * 0.15, 260)) * 2}px`,
        }}
      />

      {/* HEADER / NAVIGATION */}
      <header className="relative z-50 w-full px-6 py-4 md:px-12 md:py-6 flex justify-between items-center bg-gradient-to-b from-neutral-950/90 to-transparent">
        <div className="flex items-center gap-3">
          <LithosLogo />
          <span className="text-xl font-medium tracking-[0.2em] text-neutral-100">LITHOS</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest text-neutral-400 uppercase">
          <a href="#folds" className="hover:text-amber-400 transition-colors">Explore Folds</a>
          <a href="#stratigraphy" className="hover:text-amber-400 transition-colors">Stratigraphy</a>
          <a href="#tectonic" className="hover:text-amber-400 transition-colors">Tectonic Guides</a>
          <a href="#time" className="hover:text-amber-400 transition-colors">Geological Scale</a>
        </nav>

        {/* Right Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => setActiveIndex(prev => (prev === 0 ? 1 : 0))}
            className="text-xs font-medium uppercase tracking-wider text-neutral-400 hover:text-white transition-colors py-2 px-4"
          >
            Probe System
          </button>
          <a 
            href="#signup" 
            className="text-xs font-semibold uppercase tracking-widest text-neutral-950 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all py-2.5 px-6 rounded-sm shadow-lg shadow-amber-500/20"
          >
            Sign Up
          </a>
        </div>

        {/* Mobile menu trigger button */}
        <button 
          className="md:hidden text-neutral-100 p-2 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-neutral-950/95 flex flex-col justify-center items-center gap-8 animate-hero-reveal">
          <nav className="flex flex-col items-center gap-6 text-lg tracking-wider text-neutral-300">
            <a 
              href="#folds" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-amber-400 transition-colors"
            >
              Explore Folds
            </a>
            <a 
              href="#stratigraphy" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-amber-400 transition-colors"
            >
              Stratigraphy
            </a>
            <a 
              href="#tectonic" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-amber-400 transition-colors"
            >
              Tectonic Guides
            </a>
            <a 
              href="#time" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-amber-400 transition-colors"
            >
              Geological Scale
            </a>
          </nav>
          
          <div className="flex flex-col gap-4 w-64 pt-6 border-t border-neutral-800">
            <button 
              onClick={() => {
                setActiveIndex(prev => (prev === 0 ? 1 : 0));
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-xs font-medium uppercase tracking-wider text-neutral-300 py-3 border border-neutral-800 rounded-sm hover:-neutral-700"
            >
              Toggle Layer Preset
            </button>
            <a 
              href="#signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center text-xs font-semibold uppercase tracking-widest text-neutral-950 bg-amber-500 py-3 rounded-sm shadow-md"
            >
              Sign Up
            </a>
          </div>
        </div>
      )}

      {/* HERO HERO HEADING */}
      <main className="relative flex-1 flex flex-col justify-center items-center px-6 md:px-12 text-center pointer-events-none select-none">
        <h1 className="font-serif italic font-light text-5xl md:text-8xl text-neutral-100 flex flex-col gap-2 tracking-tight">
          <span 
            className="animate-hero-fade-up capitalize leading-none"
            style={{ animationDelay: '0.25s' }}
          >
            Layers Hold
          </span>
          <span 
            className="animate-hero-fade-up text-amber-500 font-sans not-italic text-sm md:text-xl uppercase tracking-[0.4em] font-semibold mt-2 md:mt-4 leading-none"
            style={{ animationDelay: '0.42s' }}
          >
            t a l e s &nbsp; o f &nbsp; t i m e
          </span>
        </h1>
        
        <p 
          className="animate-hero-fade-up max-w-lg mt-6 text-xs md:text-sm text-neutral-400 leading-relaxed tracking-wider font-light"
          style={{ animationDelay: '0.55s' }}
        >
          Hover and slide your cursor around to peer beneath the geological crust. 
          Discover the ancient sedimentary bands hidden under our base landscape.
        </p>
      </main>

      {/* LOWER FOOTER DETAILS */}
      <footer className="relative z-30 px-6 py-6 md:px-12 md:py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-t from-neutral-950/95 to-transparent">
        {/* Left Side: Sediment Text Block */}
        <div 
          className="animate-hero-fade-up max-w-sm flex items-start gap-4"
          style={{ animationDelay: '0.7s' }}
        >
          <div className="p-2 border border-neutral-800 bg-neutral-900/50 rounded-sm mt-1">
            <Layers className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-neutral-300 uppercase">Core Data Active</h3>
            <p className="text-[11px] text-neutral-500 mt-1 leading-normal">
              Revealing layered sandstone deposits at {Math.round(currentCoords.current.x)}px horizontal coordinates.
            </p>
          </div>
        </div>

        {/* Right Side: Start Digging Action Button */}
        <div 
          className="animate-hero-fade-up w-full md:w-auto"
          style={{ animationDelay: '0.85s' }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-stretch md:items-center">
            <div className="hidden lg:flex items-center gap-6 text-[10px] text-neutral-500 uppercase tracking-widest mr-4">
              <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> 36.162° N</span>
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> 114.150° W</span>
            </div>
            
            <a 
              href="#dig"
              className="text-center text-xs font-semibold uppercase tracking-widest text-neutral-300 border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900 active:scale-95 transition-all py-3 px-6 rounded-sm flex items-center justify-center gap-2"
            >
              Start Digging
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
