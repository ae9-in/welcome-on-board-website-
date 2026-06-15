import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Star, HelpCircle as HelpIcon } from 'lucide-react';

export default function FAQs() {
  const faqData = [
    {
      q: 'Who is eligible to participate in OnBoarding contests?',
      a: 'OnBoarding online competitions are exclusively structured for school students starting from Kindergarten (KG) all the way up to the 10th Standard. Age brackets and evaluation grids are carefully customized according to grade divisions to ensure fair grading.'
    },
    {
      q: 'How do students submit their competition entries?',
      a: 'For Handwriting and Art & Craft events, parents download standard worksheets from the dashboard. Once completed, they capture high-resolution photos or scans of the work (and a quick 30-second verification recording of the child writing/painting) and upload them directly via their online panel.'
    },
    {
      q: 'How are online tests like Quiz and Math Challenge proctored?',
      a: 'Academic tests (Quiz and Math Challenge) are hosted on our interactive platform. They are timed, multiple-choice or short-answer challenges. To keep integrity high, we utilize tab-locking proctor tools and standard question randomizations.'
    },
    {
      q: 'How are the submissions evaluated?',
      a: 'We employ a strict double-blind evaluation mechanism. Each handwriting canvas or craft piece is assigned a random serial code and reviewed by two independent academic judges from our specialist panel. If scores differ by more than 10%, a Chief Arbitrator reviews the submission.'
    },
    {
      q: 'What types of awards can students win?',
      a: 'All successful participants receive customizable Digital Participation Certificates. Students scoring 85%+ obtain E-Certificates of Excellence. The Top 3 national rank holders in each grade class receive physical engraved Gold Medals, walnut-wood Trophies, and educational vouchers!'
    },
    {
      q: 'Is there a support channel for registration errors?',
      a: 'Yes, absolutely! We provide instant WhatsApp support (available by clicking the chat balloon on the bottom-right of the page), a direct support line (8088372031), and direct support desk mail (connect@welcomeonboard.in).'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-[#F6F7FA] py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-black tracking-widest text-indigo-600 uppercase font-poppins">Common Queries</span>
          <h2 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-tighter text-[#030213]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-655 text-slate-600 font-semibold leading-relaxed max-w-xl mx-auto">
            Find answers to commonly asked questions from parents and teachers about deadlines, submissions, and trophy delivery.
          </p>
        </div>

        {/* Accordion FAQ Grid */}
        <div className="space-y-4 text-left">
          {faqData.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index}
                className="bg-white border border-black/10 hover:border-black/20 rounded-[1.5rem] shadow-xl shadow-slate-900/5 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 focus:outline-none transition-colors group cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-xl bg-[#F6F7FA] text-[#030213] border border-black/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#030213] group-hover:text-white transition-colors duration-200">
                      <HelpIcon className="w-4 h-4" />
                    </div>
                    <span className="font-poppins font-bold text-sm sm:text-base text-[#030213] mt-0.5 leading-tight group-hover:text-indigo-650 group-hover:text-indigo-600 transition-colors">
                      {faq.q}
                    </span>
                  </div>
                  <div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-indigo-605 text-indigo-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-indigo-605 group-hover:text-indigo-600" />
                    )}
                  </div>
                </button>

                {/* Animated content */}
                <div 
                  className={`transition-all duration-305 duration-300 ease-in-out ${
                    isOpen ? 'max-h-60 border-t border-black/5 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="p-6 bg-slate-50/50 text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support CTA footer */}
        <div className="mt-16 bg-white border border-black/10 text-slate-800 rounded-[2rem] p-8 text-center space-y-4 shadow-xl shadow-slate-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl"></div>
          <span className="text-[10px] tracking-widest uppercase font-black text-indigo-600">Still have a question?</span>
          <h3 className="font-poppins font-black text-xl text-[#030213]">We are here to help 24/7!</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto font-semibold">
            Send us a message from our contact desk or get quick rules verification over WhatsApp support.
          </p>
          <div className="flex justify-center pt-2">
            <a
              href="mailto:connect@welcomeonboard.in"
              className="bg-[#030213] hover:bg-slate-805 hover:bg-slate-800 text-white font-extrabold py-3.5 px-6 rounded-full text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 inline-block cursor-pointer"
            >
              Email Support Desk
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
