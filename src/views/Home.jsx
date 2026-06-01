import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const Competitions = dynamic(() => import('./Competitions'), { ssr: false });
const About        = dynamic(() => import('./About'), { ssr: false });
const Results      = dynamic(() => import('./Results'), { ssr: false });
const Gallery      = dynamic(() => import('./Gallery'), { ssr: false });
const Blog         = dynamic(() => import('./Blog'), { ssr: false });
const FAQs         = dynamic(() => import('./FAQs'), { ssr: false });
const Contact      = dynamic(() => import('./Contact'), { ssr: false });
const Register     = dynamic(() => import('./Register'), { ssr: false });

const IMAGES = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF' },
];

export default function Home({ navigateTo, setSelectedComp, selectedComp }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set isMobile safely after mount (avoids SSR window crash)
  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  // Preload all 4 images on mount
  useEffect(() => {
    IMAGES.forEach((img) => {
      const imageInstance = new Image();
      imageInstance.src = img.src;
    });
  }, []);

  // Update isMobile state on window resize (passive for perf)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize, { passive: true });
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

  return (
    <div className="bg-[#070A13] text-white min-h-screen relative overflow-x-hidden">
      {/* 1. Dynamic background glowing mesh blobs */}
      <div 
        className="absolute top-[80vh] left-[-10%] w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-all duration-700" 
        style={{ backgroundColor: IMAGES[activeIndex].bg }} 
      />
      <div 
        className="absolute top-[180vh] right-[-10%] w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-all duration-700" 
        style={{ backgroundColor: IMAGES[activeIndex].panel }} 
      />
      <div 
        className="absolute top-[320vh] left-[-15%] w-[600px] h-[600px] rounded-full blur-[180px] opacity-15 pointer-events-none transition-all duration-700" 
        style={{ backgroundColor: IMAGES[activeIndex].bg }} 
      />
      <div 
        className="absolute top-[480vh] right-[-15%] w-[600px] h-[600px] rounded-full blur-[180px] opacity-15 pointer-events-none transition-all duration-700" 
        style={{ backgroundColor: IMAGES[activeIndex].panel }} 
      />
      <div 
        className="absolute bottom-[80vh] left-[-10%] w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-all duration-700" 
        style={{ backgroundColor: IMAGES[activeIndex].bg }} 
      />

      {/* 2. Hero Section: ToonHub Carousel */}
      <section 
        id="hero"
        className="relative w-full h-screen overflow-hidden"
        style={{
          backgroundColor: IMAGES[activeIndex].bg,
          transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div className="relative w-full h-screen overflow-hidden">
          {/* Grain overlay */}
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

          {/* Giant ghost text "WELCOME" */}
          <div
            className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none uppercase font-black"
            style={{
              zIndex: 2,
              top: '18%',
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(90px, 28vw, 380px)',
              color: 'white',
              opacity: 1,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap'
            }}
          >
            WELCOME
          </div>

          {/* Carousel figurines */}
          <div className="absolute inset-0" style={{ zIndex: 3 }}>
            {IMAGES.map((img, i) => {
              let role = 'back';
              if (i === activeIndex) {
                role = 'center';
              } else if (i === (activeIndex + 3) % 4) {
                role = 'left';
              } else if (i === (activeIndex + 1) % 4) {
                role = 'right';
              }

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
              } else {
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
                    className="w-full h-full object-contain object-bottom select-none"
                    draggable="false"
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom-left text + nav buttons */}
          <div
            className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 text-white"
            style={{ zIndex: 60, maxWidth: '320px' }}
          >
            <p
              className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px]"
              style={{ letterSpacing: '0.02em', opacity: 0.95 }}
            >
              TOONHUB FIGURINES
            </p>
            <p
              className="hidden sm:block text-xs sm:text-sm mb-4 sm:mb-5"
              style={{ opacity: 0.85, lineHeight: 1.6 }}
            >
              The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
            </p>
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

          {/* Bottom-right link "DISCOVER IT" */}
          <div
            className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10"
            style={{ zIndex: 60 }}
          >
            <a
              href="#/competitions"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('competitions');
              }}
              className="flex items-center gap-2 sm:gap-3 text-white transition-opacity duration-200 cursor-pointer animate-pulse"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(20px, 4vw, 56px)',
                fontWeight: 400,
                opacity: 0.95,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                textDecoration: 'none'
              }}
            >
              <span>DISCOVER IT</span>
              <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
            </a>
          </div>
        </div>
      </section>

      {/* 3. Sections Container */}
      <div className="relative z-10">
        <section id="competitions" className="border-t border-white/[0.05]">
          <Competitions navigateTo={navigateTo} setSelectedComp={setSelectedComp} activeFigurineBg={IMAGES[activeIndex].bg} />
        </section>

        <section id="about" className="border-t border-white/[0.05]">
          <About navigateTo={navigateTo} activeFigurineBg={IMAGES[activeIndex].bg} />
        </section>

        <section id="results" className="border-t border-white/[0.05]">
          <Results navigateTo={navigateTo} activeFigurineBg={IMAGES[activeIndex].bg} />
        </section>

        <section id="gallery" className="border-t border-white/[0.05]">
          <Gallery navigateTo={navigateTo} activeFigurineBg={IMAGES[activeIndex].bg} />
        </section>

        <section id="blog" className="border-t border-white/[0.05]">
          <Blog navigateTo={navigateTo} activeFigurineBg={IMAGES[activeIndex].bg} />
        </section>

        <section id="faqs" className="border-t border-white/[0.05]">
          <FAQs navigateTo={navigateTo} activeFigurineBg={IMAGES[activeIndex].bg} />
        </section>

        <section id="contact" className="border-t border-white/[0.05]">
          <Contact navigateTo={navigateTo} activeFigurineBg={IMAGES[activeIndex].bg} />
        </section>

        <section id="register" className="border-t border-white/[0.05] pb-20">
          <Register navigateTo={navigateTo} selectedComp={selectedComp} setSelectedComp={setSelectedComp} activeFigurineBg={IMAGES[activeIndex].bg} />
        </section>
      </div>
    </div>
  );
}
