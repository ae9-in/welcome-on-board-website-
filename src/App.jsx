import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Pages
import Home from './pages/Home';
import Competitions from './pages/Competitions';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import Results from './pages/Results';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import HandwritingExam from './pages/HandwritingExam';
import WelcomeOnBoard from './pages/WelcomeOnBoard';
import SpellBee from './pages/SpellBee';

const VALID_PAGES = [
  'home', 'competitions', 'about', 'results', 'gallery',
  'blog', 'faqs', 'contact', 'register', 'quiz', 'handwriting', 'art-craft',
  'welcome', 'toonhub', 'spellbee'
];

// Pages that hide the footer (fullscreen experiences)
const FULLSCREEN_PAGES = ['quiz', 'handwriting', 'art-craft', 'welcome', 'toonhub', 'home', 'spellbee'];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedComp, setSelectedComp] = useState('');
  const [quizGrade, setQuizGrade] = useState('');
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      const sections = ['competitions', 'about', 'results', 'gallery', 'blog', 'faqs', 'contact', 'register'];
      
      if (sections.includes(hash)) {
        setCurrentPage('home');
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else if (hash && VALID_PAGES.includes(hash)) {
        setCurrentPage(hash);
        window.scrollTo(0, 0);
      } else {
        setCurrentPage('home');
        window.scrollTo(0, 0);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (pageId, opts = {}) => {
    if (opts.grade) setQuizGrade(opts.grade);
    if (opts.comp) setSelectedComp(opts.comp);
    if (opts.name) {
      setStudentName(opts.name);
      localStorage.setItem('onboreding_student_name', opts.name);
    }
    
    const sections = ['competitions', 'about', 'results', 'gallery', 'blog', 'faqs', 'contact', 'register'];
    if (sections.includes(pageId) || pageId === 'home') {
      window.location.hash = `#/${pageId}`;
      setCurrentPage('home');
      const targetId = pageId === 'home' ? 'hero' : pageId;
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 150);
    } else {
      window.location.hash = `#/${pageId}`;
      setCurrentPage(pageId);
      window.scrollTo(0, 0);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} setSelectedComp={setSelectedComp} />;
      case 'competitions':
        return <Competitions navigateTo={navigateTo} setSelectedComp={setSelectedComp} />;
      case 'about':
        return <About />;
      case 'results':
        return <Results navigateTo={navigateTo} />;
      case 'gallery':
        return <Gallery />;
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
        return (
          <Quiz
            navigateTo={navigateTo}
            grade={quizGrade}
            competition={selectedComp}
          />
        );
      case 'handwriting':
      case 'art-craft':
        return (
          <HandwritingExam
            navigateTo={navigateTo}
            grade={quizGrade}
            competition={selectedComp}
          />
        );
      case 'spellbee':
        return (
          <SpellBee
            navigateTo={navigateTo}
            grade={quizGrade}
          />
        );
      case 'welcome':
      case 'toonhub':
        return <WelcomeOnBoard navigateTo={navigateTo} />;
      default:
        return <Home navigateTo={navigateTo} setSelectedComp={setSelectedComp} />;
    }
  };

  const isFullscreen = FULLSCREEN_PAGES.includes(currentPage);

  const showNavbar = !['welcome', 'toonhub'].includes(currentPage);
  const showWidgets = !['welcome', 'toonhub', 'home'].includes(currentPage);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar currentPage={currentPage} navigateTo={navigateTo} />}
      <main className="flex-grow">
        {renderPage()}
      </main>
      {showWidgets && <WhatsAppButton />}
      {!isFullscreen && <Footer navigateTo={navigateTo} />}
    </div>
  );
}
