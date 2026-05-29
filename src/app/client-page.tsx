'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import PageLoader from '../components/PageLoader';

// ── Lazy-load all heavy views for faster initial paint ──────────────────────
const Home          = dynamic(() => import('../views/Home'),            { ssr: false });
const Competitions  = dynamic(() => import('../views/Competitions'),    { ssr: false });
const About         = dynamic(() => import('../views/About'),           { ssr: false });
const Contact       = dynamic(() => import('../views/Contact'),         { ssr: false });
const FAQs          = dynamic(() => import('../views/FAQs'),            { ssr: false });
const Results       = dynamic(() => import('../views/Results'),         { ssr: false });
const Gallery       = dynamic(() => import('../views/Gallery'),         { ssr: false });
const Blog          = dynamic(() => import('../views/Blog'),            { ssr: false });
const Register      = dynamic(() => import('../views/Register'),        { ssr: false });
const Quiz          = dynamic(() => import('../views/Quiz'),            { ssr: false });
const HandwritingExam = dynamic(() => import('../views/HandwritingExam'), { ssr: false });
const WelcomeOnBoard  = dynamic(() => import('../views/WelcomeOnBoard'),  { ssr: false });

const VALID_PAGES = [
  'home', 'competitions', 'about', 'results', 'gallery',
  'blog', 'faqs', 'contact', 'register', 'quiz', 'handwriting', 'art-craft',
  'welcome', 'toonhub', 'spellbee',
];

const FULLSCREEN_PAGES = ['quiz', 'handwriting', 'art-craft', 'welcome', 'toonhub', 'home', 'spellbee'];

// Smooth section transition skeleton shown while lazy view loads
function SectionSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
        <p className="text-white/20 text-xs tracking-widest uppercase font-bold">Loading…</p>
      </div>
    </div>
  );
}

export default function ClientPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedComp, setSelectedComp] = useState('');
  const [quizGrade, setQuizGrade] = useState('');
  const [quizSubject, setQuizSubject] = useState('general'); // 'math' | 'general'
  const [studentName, setStudentName] = useState('');
  const [pageKey, setPageKey] = useState(0); // force re-mount for smooth transitions

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      const sections = ['competitions', 'about', 'results', 'gallery', 'blog', 'faqs', 'contact', 'register'];

      if (sections.includes(hash)) {
        setCurrentPage('home');
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (hash && VALID_PAGES.includes(hash)) {
        if (hash === 'spellbee') {
          router.push('/competitions/modern-bee');
          return;
        }
        setCurrentPage(hash);
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [router]);

  const navigateTo = (pageId: string, opts: any = {}) => {
    if (opts.grade) setQuizGrade(opts.grade);
    if (opts.comp) setSelectedComp(opts.comp);
    if (opts.subject) setQuizSubject(opts.subject);
    if (opts.name) {
      setStudentName(opts.name);
      localStorage.setItem('onboreding_student_name', opts.name);
    }

    if (pageId === 'spellbee') {
      router.push('/competitions/modern-bee');
      return;
    }

    const sections = ['competitions', 'about', 'results', 'gallery', 'blog', 'faqs', 'contact', 'register'];
    if (sections.includes(pageId) || pageId === 'home') {
      window.location.hash = `#/${pageId}`;
      setCurrentPage('home');
      const targetId = pageId === 'home' ? 'hero' : pageId;
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo(0, 0);
      }, 150);
    } else {
      window.location.hash = `#/${pageId}`;
      setCurrentPage(pageId);
      setPageKey((k) => k + 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} setSelectedComp={setSelectedComp} selectedComp={selectedComp} />;
      case 'competitions':
        return <Competitions navigateTo={navigateTo} setSelectedComp={setSelectedComp} activeFigurineBg="#6366f1" />;
      case 'about':
        return <About activeFigurineBg="#6366f1" />;
      case 'results':
        return <Results navigateTo={navigateTo} />;
      case 'gallery':
        return <Gallery activeFigurineBg="#6366f1" />;
      case 'blog':
        return <Blog />;
      case 'faqs':
        return <FAQs />;
      case 'contact':
        return <Contact />;
      case 'register':
        return (
          <Register
            selectedComp={selectedComp}
            setSelectedComp={setSelectedComp}
            navigateTo={navigateTo}
          />
        );
      case 'quiz':
        return <Quiz navigateTo={navigateTo} grade={quizGrade} competition={selectedComp} subject={quizSubject} />;
      case 'handwriting':
      case 'art-craft':
        return <HandwritingExam navigateTo={navigateTo} grade={quizGrade} competition={selectedComp} />;
      case 'welcome':
      case 'toonhub':
        return <WelcomeOnBoard navigateTo={navigateTo} />;
      default:
        return <Home navigateTo={navigateTo} setSelectedComp={setSelectedComp} selectedComp={selectedComp} />;
    }
  };

  const isFullscreen = FULLSCREEN_PAGES.includes(currentPage);
  const showNavbar = !['welcome', 'toonhub'].includes(currentPage);
  const showWidgets = !['welcome', 'toonhub', 'home'].includes(currentPage);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Smooth page loader shown on first mount */}
      <PageLoader />

      {showNavbar && <Navbar currentPage={currentPage} navigateTo={navigateTo} />}

      <main className="flex-grow">
        <Suspense fallback={<SectionSkeleton />}>
          {/* pageKey triggers a visual re-mount for non-home page changes */}
          <div key={`${currentPage}-${pageKey}`}>
            {renderPage()}
          </div>
        </Suspense>
      </main>

      {showWidgets && <WhatsAppButton />}
      {!isFullscreen && <Footer navigateTo={navigateTo} />}
    </div>
  );
}
