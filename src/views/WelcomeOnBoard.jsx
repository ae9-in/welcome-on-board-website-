import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const IMAGES = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF' },
];

export default function WelcomeOnBoard({ navigateTo }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [loadedImages, setLoadedImages] = useState({});

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((img) => {
      const imageInstance = new Image();
      imageInstance.src = img.src;
    });
  }, []);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle slide transition with 650ms lock animation
  const navigate = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (direction === 'next') {
      setActiveIndex((prev) => (prev + 1) % 4);
    } else {
      setActiveIndex((prev) => (prev + 3) % 4);
    }
    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  // Auto-scroll (auto-rotate slides) every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      navigate('next');
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIndex, isAnimating]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="relative w-full h-screen overflow-hidden">
        {/* 1. Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
          }}
        />

        {/* 2. Giant ghost text "WELCOME" */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none uppercase font-black"
          style={{
            zIndex: 2,
            top: '18%',
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(70px, 16vw, 280px)',
            color: 'white',
            opacity: 1,
            lineHeight: 1,
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap'
          }}
        >
          WELCOME
        </div>

        {/* 3. Top-left brand label "TOONHUB" */}
        <div
          onClick={() => navigateTo && navigateTo('home')}
          className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase text-white cursor-pointer select-none"
          style={{
            zIndex: 60,
            opacity: 0.9,
            letterSpacing: '0.18em'
          }}
        >
          TOONHUB
        </div>

        {/* 4. Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((img, i) => {
            // Role assignments derived from activeIndex
            let role = 'back';
            if (i === activeIndex) {
              role = 'center';
            } else if (i === (activeIndex + 3) % 4) {
              role = 'left';
            } else if (i === (activeIndex + 1) % 4) {
              role = 'right';
            }

            // Style configuration per role
            let style = {};
            if (role === 'center') {
              style = {
                transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
                filter: 'blur(0px)',
                opacity: 1,
                zIndex: 20,
                left: '50%',
                height: isMobile ? '60%' : '92%',
                bottom: isMobile ? '22%' : '0px',
              };
            } else if (role === 'left') {
              style = {
                transform: 'translateX(-50%) scale(1)',
                filter: 'blur(2px)',
                opacity: 0.85,
                zIndex: 10,
                left: isMobile ? '20%' : '30%',
                height: isMobile ? '16%' : '28%',
                bottom: isMobile ? '32%' : '12%',
              };
            } else if (role === 'right') {
              style = {
                transform: 'translateX(-50%) scale(1)',
                filter: 'blur(2px)',
                opacity: 0.85,
                zIndex: 10,
                left: isMobile ? '80%' : '70%',
                height: isMobile ? '16%' : '28%',
                bottom: isMobile ? '32%' : '12%',
              };
            } else { // back role
              style = {
                transform: 'translateX(-50%) scale(1)',
                filter: 'blur(4px)',
                opacity: 1,
                zIndex: 5,
                left: '50%',
                height: isMobile ? '13%' : '22%',
                bottom: isMobile ? '32%' : '12%',
              };
            }

             return (
              <div
                key={i}
                className="absolute aspect-[0.6/1]"
                style={{
                  ...style,
                  transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, filter, opacity',
                }}
              >
                <img
                  src={img.src}
                  alt={`Toon figurine ${i + 1}`}
                  className={`w-full h-full object-contain object-bottom select-none transition-transform duration-1000 ${
                    role === 'center' ? 'animate-float' : ''
                  }`}
                  draggable="false"
                  onLoad={() => setLoadedImages((prev) => ({ ...prev, [i]: true }))}
                  style={{
                    opacity: loadedImages[i] ? 1 : 0,
                    filter: loadedImages[i] ? 'none' : 'blur(10px)',
                    transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), filter 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 5. Bottom-left nav buttons */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 text-white"
          style={{ zIndex: 60 }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('prev')}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white transition-all duration-150 hover:scale-108 hover:bg-white/12 active:scale-95 cursor-pointer focus:outline-none"
              aria-label="Previous figurine"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigate('next')}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center text-white transition-all duration-150 hover:scale-108 hover:bg-white/12 active:scale-95 cursor-pointer focus:outline-none"
              aria-label="Next figurine"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right link "DISCOVER IT" */}
        <div
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10"
          style={{ zIndex: 60 }}
        >
          <a
            href="#/competitions"
            onClick={(e) => {
              e.preventDefault();
              if (navigateTo) navigateTo('competitions');
            }}
            className="flex items-center gap-2 sm:gap-3 text-white transition-opacity duration-200 cursor-pointer"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.95'; }}
          >
            <span>DISCOVER IT</span>
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </div>
  );
}
