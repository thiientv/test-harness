import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Figurines metadata array matching rich background colors and accents
/**
 * Represents metadata for a detailed 3D styled figurine card and layout colors.
 */
export interface Figurine {
  id: number;
  /** Custom display name for the figurine card header */
  name: string;
  /** Series taxonomy string, format: 'SERIES XX // TOY XX' */
  category: string;
  /** Long copy describing the figurine specs and aesthetics */
  description: string;
  /** Image source URL */
  imageUrl: string;
  /** Hex code for base background color */
  bgColor: string;
  /** Main accent styling color (hex) */
  accentColor: string;
  /** Text color tailored to readability constraints of the background */
  textColor: string;
  /** Low-opacity accent color for decorative panels and pill containers */
  panelColor: string;
}

export const IMAGES: Figurine[] = [
  {
    id: 1,
    name: "CYBER NEON KAT",
    category: "SERIES 01 // TOY 01",
    description: "An ultra-detailed cyborg figurine in electric pink vinyl, featuring translucent resin ears and hyper-reactive neon glow accents styled for urban display.",
    imageUrl: "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80",
    bgColor: "#1e1124", // Deep plum/violet
    accentColor: "#ec4899", // Neon Pink
    textColor: "#fdf2f8",
    panelColor: "rgba(236, 72, 153, 0.1)"
  },
  {
    id: 2,
    name: "LEGO COSMIC CADET",
    category: "SERIES 01 // TOY 02",
    description: "A throwback vintage space explorer figurine. Complete with a modular chrome visor, oxygen tanks, and a custom build stand for astronomical posing.",
    imageUrl: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
    bgColor: "#0f172a", // Deep slate blue
    accentColor: "#3b82f6", // Electric Blue
    textColor: "#f0f9ff",
    panelColor: "rgba(59, 130, 246, 0.1)"
  },
  {
    id: 3,
    name: "FUNK VORTEX BOY",
    category: "SERIES 01 // TOY 03",
    description: "A surreal cartoon character manifesting from a swirling digital canvas. Rendered with custom high-gloss lacquer and stylized gradient patterns.",
    imageUrl: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=600&auto=format&fit=crop&q=80",
    bgColor: "#180f2a", // Dark purple
    accentColor: "#a855f7", // Bright purple/violet
    textColor: "#faf5ff",
    panelColor: "rgba(168, 85, 247, 0.1)"
  },
  {
    id: 4,
    name: "RETRO CHROME BOT",
    category: "SERIES 01 // TOY 04",
    description: "Inspired by mid-century sci-fi toy design, this polished tin robot figurine boasts movable joint pins, metallic silver rivets, and nostalgic wind-up keys.",
    imageUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&auto=format&fit=crop&q=80",
    bgColor: "#1c1c1c", // Charcoal grey
    accentColor: "#fbbf24", // Amber yellow
    textColor: "#fffbeb",
    panelColor: "rgba(251, 191, 36, 0.1)"
  }
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [preloaded, setPreloaded] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const imagePreloadRefs = useRef<HTMLImageElement[]>([]);

  // 1. Detect screen size (Mobile threshold = 640px)
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // 2. Preload all figurine images on mount
  useEffect(() => {
    let loadedCount = 0;
    const preloadList = IMAGES.map((item) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === IMAGES.length) {
          setPreloaded(true);
        }
      };
      img.onerror = () => {
        console.error(`Failed to preload image: ${item.imageUrl}`);
        loadedCount++;
        if (loadedCount === IMAGES.length) {
          setPreloaded(true);
        }
      };
      img.src = item.imageUrl;
      return img;
    });
    imagePreloadRefs.current = preloadList;

    // Fail-safe timeout if loading takes too long
    const timer = setTimeout(() => {
      if (loadedCount < IMAGES.length) {
        console.warn("Preload timeout of 3s triggered before all assets retrieved.");
      }
      setPreloaded(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      preloadList.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // 3. Navigation with state animation locking
  const navigate = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (direction === 'next') {
      setActiveIndex((prev) => (prev + 1) % IMAGES.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  // 4. Calculate slide position state roles
  /**
   * Calculates the position state role of a slide relative to the active slide index.
   * Works dynamically for any carousel length >= 3.
   * 
   * @param {number} index - Index of the figurine in the array
   * @returns {'center' | 'left' | 'right' | 'back'} Visual role mapping
   */
  const getRole = (index: number): 'center' | 'left' | 'right' | 'back' => {
    const diff = (index - activeIndex + IMAGES.length) % IMAGES.length;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === IMAGES.length - 1) return 'left';
    return 'back';
  };

  const getRoleStyles = (role: 'center' | 'left' | 'right' | 'back') => {
    // Style configurations transitioning over 650ms.
    switch (role) {
      case 'center':
        return {
          opacity: 1,
          transform: 'translateX(0) scale(1)',
          filter: 'blur(0px)',
          zIndex: 40,
        };
      case 'left':
        return {
          opacity: 0.6,
          transform: isMobile ? 'translateX(-80px) scale(0.65)' : 'translateX(-220px) scale(0.75)',
          filter: 'blur(2px)',
          zIndex: 30,
        };
      case 'right':
        return {
          opacity: 0.6,
          transform: isMobile ? 'translateX(80px) scale(0.65)' : 'translateX(220px) scale(0.75)',
          filter: 'blur(2px)',
          zIndex: 30,
        };
      case 'back':
      default:
        return {
          opacity: 0,
          transform: 'translateX(0) scale(0.4)',
          filter: 'blur(10px)',
          zIndex: 10,
        };
    }
  };

  const currentItem = IMAGES[activeIndex];

  return (
    <div
      style={{
        backgroundColor: currentItem.bgColor,
        transition: 'background-color 650ms cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className={`relative w-screen h-screen flex flex-col justify-between overflow-hidden p-6 sm:p-12 transition-opacity duration-700 ${preloaded ? 'opacity-100' : 'opacity-0'}`}
      data-testid="hero-container"
    >
      {/* Texture grain SVG overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-50 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        data-testid="grain-overlay"
      />

      {/* Brand Header */}
      <header className="relative flex items-center justify-between z-[60] w-full">
        <div 
          className="font-display text-2xl tracking-[0.18em] select-none transition-colors duration-650"
          style={{ color: currentItem.textColor }}
        >
          TOONHUB
        </div>
        <div className="text-xs uppercase tracking-widest opacity-60 font-sans hidden sm:block">
          Figurine Showcase
        </div>
      </header>

      {/* Backdrop Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden" aria-hidden="true">
        <div 
          className="font-display text-[15vw] sm:text-[18vw] leading-none select-none tracking-wider opacity-10 transition-colors duration-650"
          style={{ color: currentItem.accentColor }}
        >
          3D SHAPE
        </div>
      </div>

      {/* Interactive Figurine Carousel */}
      <main className="relative flex-1 flex items-center justify-center z-30">
        <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
          {IMAGES.map((item, idx) => {
            const role = getRole(idx);
            const styles = getRoleStyles(role);

            return (
              <div
                key={item.id}
                style={{
                  ...styles,
                  transition: 'transform 650ms cubic-bezier(0.25, 1, 0.5, 1), opacity 650ms cubic-bezier(0.25, 1, 0.5, 1), filter 650ms cubic-bezier(0.25, 1, 0.5, 1)',
                }}
                className="absolute flex flex-col items-center select-none"
                data-testid={`figurine-card-${item.id}`}
                data-role={role}
              >
                {/* Circular Glass Card Plateline */}
                <div 
                  style={{
                    boxShadow: `0 25px 50px -12px ${item.bgColor}`,
                    borderColor: `${item.accentColor}33` // Accent with low alpha opacity
                  }}
                  className="w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-white/5 border backdrop-blur-md flex items-center justify-center relative group"
                >
                  {/* Decorative accent glow behind image */}
                  <div 
                    style={{ backgroundColor: item.accentColor }}
                    className="absolute inset-4 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"
                  />

                  {/* Figure Image */}
                  {imageErrors[item.id] ? (
                    <div 
                      style={{ color: item.accentColor }} 
                      className="text-2xl font-display uppercase opacity-55 select-none text-center px-4"
                      data-testid={`image-fallback-${item.id}`}
                    >
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ) : (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                      className="h-[85%] w-auto object-contain absolute bottom-4 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-500"
                      draggable="false"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Interface */}
      <footer className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 z-[60] w-full">
        {/* Left Side: Figurine Details + Controls */}
        <div className="flex flex-col gap-4 max-w-md">
          {/* Animated panel color bg pill for Series */}
          <div className="self-start">
            <span 
              style={{ 
                color: currentItem.accentColor,
                backgroundColor: currentItem.panelColor,
              }}
              className="text-2xs font-bold font-sans tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/5 uppercase transition-all duration-650"
            >
              {currentItem.category}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-4xl sm:text-5xl tracking-wide uppercase transition-colors duration-650" style={{ color: currentItem.textColor }}>
              {currentItem.name}
            </h1>
            <p className="text-sm font-sans tracking-wide text-white/70 leading-relaxed font-light">
              {currentItem.description}
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => navigate('prev')}
              disabled={isAnimating}
              style={{ borderColor: `${currentItem.textColor}33`, color: currentItem.textColor }}
              className="w-12 h-12 rounded-full border flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all disabled:opacity-40"
              aria-label="Previous Figurine"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => navigate('next')}
              disabled={isAnimating}
              style={{ borderColor: `${currentItem.textColor}33`, color: currentItem.textColor }}
              className="w-12 h-12 rounded-full border flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all disabled:opacity-40"
              aria-label="Next Figurine"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Side: Link Discover It Action */}
        <div className="flex items-center sm:justify-end">
          <a
            href="https://toonhub.example.com/discover"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              backgroundColor: currentItem.accentColor,
              color: currentItem.bgColor,
            }}
            className="flex items-center gap-3 px-6 py-4 rounded-full font-display tracking-widest text-sm hover:opacity-90 active:scale-95 transition-all duration-300 shadow-lg"
          >
            <span>DISCOVER IT</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </footer>
    </div>
  );
}
