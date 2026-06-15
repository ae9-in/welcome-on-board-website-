import React from 'react';
import { Target, Heart, Eye, Users, Award, ShieldCheck } from 'lucide-react';

export default function About({ activeFigurineBg }) {
  const values = [
    {
      title: 'Inclusivity First',
      desc: 'Welcoming school students of all abilities from KG to 10th Standard across standard learning levels.',
      icon: <Users className="w-6 h-6 text-blue-400" />,
      bg: 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]',
    },
    {
      title: 'Healthy Joyful Learning',
      desc: 'Designing quizzes and tasks that focus on positive improvement and vocabulary gains rather than performance stress.',
      icon: <Heart className="w-6 h-6 text-rose-405 text-rose-400" />,
      bg: 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]',
    },
    {
      title: 'Double-Blind Integrity',
      desc: 'Every art canvas and handwriting cursive worksheet undergoes dual evaluation by specialists to keep rankings unbiased.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-white border border-black/10 hover:border-black/20',
    },
  ];

  const team = [
    { name: 'Dr. Amanda Pierce', role: 'Chief Executive & Pedagogy Lead', spec: 'Ph.D. in Child Psychology', initials: 'AP', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'Prof. Ronald Vance', role: 'Chief Computational Math Arbitrator', spec: 'Ex-Olympiad Scholar', initials: 'RV', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Sonia Fernandez', role: 'Dean of Fine Arts & Design Events', spec: 'Fine Arts Director', initials: 'SF', bg: 'bg-pink-50 text-pink-700 border-pink-200' },
    { name: 'Arthur Pendelton', role: 'Language Curator & Spelling Expert', spec: 'Linguistics Expert', initials: 'AP', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  ];

  return (
    <div className="bg-[#F6F7FA] py-20 text-left min-h-screen">
      {/* 1. INTRO / HEADER */}
      <section className="relative overflow-hidden mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-black tracking-widest text-indigo-600 uppercase font-poppins">Get to Know Us</span>
          <h2 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-tighter text-[#030213]">
            Inspiring the Next Generation of Achievers
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-slate-600 font-semibold leading-relaxed">
            OnBoarding is a leading global online competition workspace designed to channel student competitive spirit into constructive learning and academic skill refinement.
          </p>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white border border-black/10 p-8 rounded-[2rem] shadow-xl shadow-slate-900/5 relative overflow-hidden flex flex-col justify-between transition-colors duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-3xl flex items-center justify-center font-bold">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-4">
                <h3 className="font-poppins font-extrabold text-xl sm:text-2xl text-[#030213]">Our Mission</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                  To democratize student talent discovery by offering structured, accessible, and high-quality online contests that motivate children to enhance their spellings, logic, arithmetic speed, fine-motor styles, and artistic thinking in a happy learning framework.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white border border-black/10 p-8 rounded-[2rem] shadow-xl shadow-slate-900/5 relative overflow-hidden flex flex-col justify-between transition-colors duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-3xl flex items-center justify-center font-bold">
                <Eye className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-4">
                <h3 className="font-poppins font-extrabold text-xl sm:text-2xl text-[#030213]">Our Vision</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                  To become the world's most trusted, engaging, and transparent competitive educational ecosystem for young minds, bridging gaps between regional schools and empowering parents with diagnostic learning feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-black tracking-widest text-indigo-600 uppercase font-poppins">Our Foundations</span>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#030213]">
              The Values That Drive Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, idx) => (
              <div 
                key={idx} 
                className={`p-8 border rounded-[2rem] text-left space-y-4 shadow-xl shadow-slate-900/5 bg-white hover:border-black/20 transition-all duration-300 ${value.bg}`}
              >
                <div className="w-12 h-12 bg-[#F6F7FA] border border-black/5 rounded-[1.5rem] flex items-center justify-center shadow-md">
                  {value.icon}
                </div>
                <h3 className="font-poppins font-bold text-base sm:text-lg text-[#030213]">{value.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TEAM SECTION */}
      <section className="mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-black tracking-widest text-indigo-600 uppercase font-poppins">Who We Are</span>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#030213]">
              Meet Our Leadership Panel
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-semibold">
              A curated panel of teachers, specialists, and academic judges committed to healthy cognitive development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, idx) => (
              <div 
                key={idx}
                className="bg-white border border-black/10 hover:border-black/20 p-6 rounded-[2rem] shadow-xl shadow-slate-900/5 transition-all duration-300 text-center space-y-4 flex flex-col justify-between hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-900/10"
              >
                <div className="space-y-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center font-poppins font-black text-2xl border mx-auto mb-2 shadow-md ${t.bg}`}>
                    {t.initials}
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-sm sm:text-base text-[#030213]">{t.name}</h3>
                    <span className="block text-xs font-bold text-indigo-600 mt-1">{t.role}</span>
                    <span className="block text-[10px] text-slate-500 font-semibold mt-1">{t.spec}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
