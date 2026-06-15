import React, { useState } from 'react';
import { Award, Mail, Phone, MapPin, Send, CheckCircle, Flame } from 'lucide-react';

export default function Footer({ navigateTo }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="relative bg-slate-900 text-slate-400 pt-16 pb-12 overflow-hidden border-t-4 border-amber-400">
      {/* Decorative colored backgrounds */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-400" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => navigateTo('home')}>
              <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 p-2 rounded-xl shadow-md transform group-hover:rotate-6 transition-transform">
                <Award className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl tracking-wider uppercase text-white" style={{ fontFamily: "'Anton', sans-serif" }}>
                Welcome On<span className="text-black"> Board</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Empowering school students from Kindergarten (KG) to 10th Standard to discover their latent talents through national online educational competitions. Learn, compete, and shine!
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <a
                  key={social}
                  href={`#social`}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-900 text-slate-400 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                >
                  <i className={`fab fa-${social} text-lg`}></i>
                  {/* Fallback characters for standard icons */}
                  <span className="capitalize text-xs font-semibold px-1">
                    {social[0].toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-6">
            <h3 className="font-poppins text-lg font-bold text-white tracking-wider border-b-2 border-slate-800 pb-2">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { id: 'home', label: 'Home' },
                { id: 'competitions', label: 'Competitions' },
                { id: 'about', label: 'About Us' },
                { id: 'gallery', label: 'Student Gallery' },
                { id: 'blog', label: 'Blogs & Articles' },
                { id: 'faqs', label: 'FAQs' },
                { id: 'contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => navigateTo(link.id)}
                    className="hover:text-amber-400 transition-colors duration-200 text-left flex items-center space-x-2"
                  >
                    <span className="text-amber-400 text-xs">✦</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitions Quick Links */}
          <div className="space-y-6">
            <h3 className="font-poppins text-lg font-bold text-white tracking-wider border-b-2 border-slate-800 pb-2">
              Our Competitions
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                'Quiz Competition',
                'Spell Bee Competition',
                'Math Challenge',
                'Art & Craft Competition',
                'Handwriting Competition',
              ].map((comp) => (
                <li key={comp}>
                  <button
                    onClick={() => navigateTo('competitions')}
                    className="hover:text-amber-400 transition-colors duration-200 text-left flex items-center space-x-2"
                  >
                    <span className="text-indigo-400 text-xs">●</span>
                    <span>{comp}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/50">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">Target Audience</span>
              <p className="text-xs text-slate-300 font-medium">KG to 10th Standard Students exclusively.</p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-6">
            <h3 className="font-poppins text-lg font-bold text-white tracking-wider border-b-2 border-slate-800 pb-2">
              Join the Fun!
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Subscribe to get notifications about new competitions, guidelines, preparation worksheets, and direct results updates!
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm border border-slate-700/60"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg flex items-center justify-center transition-colors duration-150"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {submitted && (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold py-1 animate-pulse">
                  <CheckCircle className="w-4 h-4" />
                  <span>Success! Check your inbox soon.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 pb-6 border-t border-slate-800 mt-12 text-sm text-slate-400">
          <div className="flex items-center space-x-3 bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800/80">
            <Phone className="w-5 h-5 text-amber-400" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-indigo-400">Call/WhatsApp</span>
              <a href="tel:8088372031" className="text-white hover:text-amber-400 font-semibold font-poppins">8088372031</a>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800/80">
            <Mail className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-indigo-400">Direct Email</span>
              <a href="mailto:connect@welcomeonboard.in" className="text-white hover:text-indigo-400 font-semibold font-poppins">connect@welcomeonboard.in</a>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-800/40 p-3.5 rounded-2xl border border-slate-800/80">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-indigo-400">Office Address</span>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Behive+trinity+circle%2C+Brigade+Road" 
                target="_blank" 
                rel="noreferrer" 
                className="text-white hover:text-emerald-400 font-semibold font-poppins"
              >
                Behive trinity circle, Brigade Road
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Welcome On Board Online Competitions. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0 font-medium">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-white transition-colors">Cookie settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
