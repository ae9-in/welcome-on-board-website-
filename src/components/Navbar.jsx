import React, { useState, useEffect } from 'react';
import { Menu, X, Award, Flame } from 'lucide-react';

export default function Navbar({ currentPage, navigateTo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'about', label: 'About Us' },
    { id: 'results', label: 'Results' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'blog', label: 'Blog' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId) => {
    navigateTo(pageId);
    setIsOpen(false);
  };

  const isOverlay = currentPage === 'home' && !isScrolled;

  return (
    <nav className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 " + (isOverlay ? "bg-transparent border-b border-transparent text-white" : "bg-[#F6F7FA]/90 backdrop-blur-lg border-b border-black/10 text-slate-900 shadow-sm")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 p-2.5 rounded-2xl shadow-md transform group-hover:rotate-12 transition-transform duration-300">
              <Award className="h-7 w-7 text-white" />
            </div>
            <div>
              <span 
                className={"text-2xl tracking-wider uppercase transition-colors block " + (isOverlay ? "text-white" : "text-[#030213]")}
                style={{ fontFamily: "'Anton', sans-serif", lineHeight: 1 }}
              >
                On<span className={isOverlay ? "text-white" : "text-black"}>Boarding</span>
              </span>
              <div className={"text-[10px] font-bold tracking-widest uppercase mt-0.5 block transition-colors " + (isOverlay ? "text-white/70" : "text-slate-500")}>
                KG to 10th Grade
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 focus:outline-none ${
                    isActive 
                      ? isOverlay
                        ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                        : 'bg-[#030213] text-white shadow-sm'
                      : isOverlay
                        ? 'text-white/75 hover:text-white hover:bg-white/5'
                        : 'text-slate-700 hover:text-[#030213] hover:bg-black/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Register CTA */}
          <div className="hidden xl:flex items-center">
            <button
              onClick={() => handleNavClick('register')}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-bold text-white rounded-2xl group bg-gradient-to-br from-orange-500 to-yellow-400 group-hover:from-orange-500 group-hover:to-yellow-400 hover:text-white focus:ring-4 focus:outline-none focus:ring-orange-200 mt-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-transform duration-150"
            >
              <span className={`relative px-6 py-2.5 transition-all ease-in duration-75 rounded-[14px] group-hover:bg-opacity-0 flex items-center space-x-2 ${isOverlay ? 'bg-indigo-900' : 'bg-[#030213]'}`}>
                <Flame className="w-4 h-4 text-orange-400 group-hover:text-white animate-pulse" />
                <span>Register Now</span>
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-xl focus:outline-none transition-colors ${isOverlay ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-[#030213] hover:bg-black/5'}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`xl:hidden fixed inset-x-0 top-20 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        } ${isOverlay ? 'bg-[#070A13]/95 border-white/10 text-white' : 'bg-[#F6F7FA]/95 border-black/10 text-slate-900'} backdrop-blur-xl border-b`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1.5 bg-transparent">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold tracking-wide transition-all ${
                  isActive 
                    ? isOverlay
                      ? 'bg-white/15 text-white shadow-md'
                      : 'bg-[#030213] text-white shadow-md'
                    : isOverlay
                      ? 'text-white/75 hover:bg-white/5 hover:text-white'
                      : 'text-slate-700 hover:bg-black/5 hover:text-[#030213]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className={`pt-4 border-t mt-4 px-2 ${isOverlay ? 'border-white/10' : 'border-black/10'}`}>
            <button
              onClick={() => handleNavClick('register')}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition-transform"
            >
              <Flame className="w-5 h-5 text-white animate-bounce" />
              <span>Register Now</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
