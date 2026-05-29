import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, X, ArrowRight, User, Calculator, PenTool } from 'lucide-react';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "How to Boost Your Child's Spelling & Vocabulary Skills",
      excerpt: "Discover simple gamified methods, word banks, and phonetics guidelines that spark a natural interest in reading and spelling confidence.",
      date: 'May 18, 2026',
      readTime: '5 min read',
      author: 'Dr. Amanda Pierce',
      image: '/blog_spelling.png',
      icon: BookOpen,
      iconColor: 'text-amber-650 text-amber-600',
      bgGradient: 'from-amber-50 to-orange-100',
      content: `
Spelling is one of the foundational stones of overall literacy. However, forcing children to copy down words 20 times is rarely the most effective cognitive tool. Instead, educational psychology suggests that contextual, active learning is far superior.

### 1. Introduce Phonetics Mapping
Encourage your children to break words down into phonemes (sound segments). Understanding that "ph" makes an "f" sound or that double consonants modify vowel weights makes vocabulary feel like a logical code rather than a chore.

### 2. Gamify Word Searches
Play spelling bees during road trips, kitchen chores, or breakfast sessions. Make it light-hearted! Set up a dynamic score card on the refrigerator and reward spelling triumphs with reading tokens.

### 3. Read Together & Spot Errors
During night-time stories, point out unusual spellings (like "knight" or "scent"). Ask children to write down words in print or cursive. OnBoarding provides custom vocabulary word banks that make spelling prep extremely interactive! Try them today.
      `
    },
    {
      id: 2,
      title: "5 Fun Math Games to Boost Arithmetic Speeds for Kids",
      excerpt: "Math doesn't have to be intimidating! Learn these highly interactive everyday home logic games that make numbers exciting for KG to Grade 5.",
      date: 'May 14, 2026',
      readTime: '4 min read',
      author: 'Prof. Ronald Vance',
      image: '/blog_math.png',
      icon: Calculator,
      iconColor: 'text-blue-650 text-blue-600',
      bgGradient: 'from-blue-55 from-blue-50 to-indigo-100',
      content: `
Math doesn't have to be intimidating! By introducing play and logic models, we can transform arithmetic concepts into thrilling riddles.

### 1. The Grocery Estimator
When shopping with your children, ask them to keep a mental total of items. For younger standard kids, focus on simple sums. For older grades, ask them to calculate discount percentages (e.g. 15% off $12).

### 2. Grid Dice Challenges
Roll two dice and have kids multiply, add, or subtract the results as quickly as possible. The fast paced dynamic creates visual logic synapses that help solve complex test sheets later.

### 3. Shape Hunt
Walk around the living room and challenge standard kids to find circles, trapezoids, or right angles. Connecting geometry terms with physical tables, clocks, or roofs makes science real!
      `
    },
    {
      id: 3,
      title: "Why Neat Handwriting Still Matters in a Digital World",
      excerpt: "Keyboard typing is common, but neat penmanship activates specific cognitive neural pathways, increases motor accuracy, and secures examination scores.",
      date: 'May 10, 2026',
      readTime: '6 min read',
      author: 'Sonia Fernandez',
      image: '/blog_handwriting.png',
      icon: PenTool,
      iconColor: 'text-violet-650 text-violet-600',
      bgGradient: 'from-violet-55 from-violet-50 to-purple-100',
      content: `
With tablets and computers dominating modern primary classrooms, parents often ask: "Why focus on cursive or neat handwriting anymore?" Research in neuroscience shows that handwriting is far more than a physical tool; it is a critical cognitive accelerator.

### 1. Brain and Hand Synapses
Functional MRI scans reveal that when children write letters by hand, specific neural circuits in the reading network are activated—circuits that remain completely dormant during keyboard typing. Penmanship forces letter visualization, which directly reinforces reading recall.

### 2. Motor Coordination Gains
Controlling paper pencil alignments, keeping spaces neat, and making uniform curves enhances fine-motor precision and spatial planning. This physical control translates to higher focus thresholds.

### 3. Exam Score Advantages
In standard school exams, double-blind researchers note that clean, symmetrical writing consistently scores higher than messy papers, even with identical content. Neatness showcases respect, organization, and mental clarity. Download our cursive guides today!
      `
    }
  ];

  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="bg-[#F6F7FA] py-20 text-left min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black tracking-widest text-indigo-650 text-indigo-600 uppercase font-poppins font-bold">OnBoarding Blogs</span>
          <h2 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-tighter text-[#030213]">
            Educational Blogs & Guides
          </h2>
          <p className="text-sm text-slate-655 text-slate-600 font-semibold leading-relaxed">
            Discover modern tips, rules analysis, parent support checklists, and vocabulary learning advice curated by child development specialists.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <div 
              key={post.id}
              className="bg-white border border-black/10 hover:border-black/20 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-300 flex flex-col justify-between hover:scale-[1.015]"
            >
              <div>
                {/* Graphics element */}
                <div className={`h-48 bg-gradient-to-tr ${post.bgGradient} flex items-center justify-center relative overflow-hidden`}>
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <post.icon className={`w-16 h-16 ${post.iconColor} filter drop-shadow-md`} />
                  )}
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] text-slate-800 border border-black/10 font-bold uppercase tracking-wider">
                    OnBoarding Editorial
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="font-poppins font-extrabold text-base sm:text-lg text-[#030213] leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-655 text-slate-600 font-semibold leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Read button */}
              <div className="p-6 pt-0 border-t border-black/5 mt-4 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 font-bold flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{post.author}</span>
                </span>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-indigo-600 hover:text-indigo-805 hover:text-indigo-800 flex items-center space-x-1 hover:underline cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 font-black" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Dynamic Full Article Modal popup */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full border-[12px] border-black relative overflow-hidden flex flex-col max-h-[85vh] p-1 animate-scale-up">
              
              {/* Header Close button */}
              <div className="p-5 border-b border-black/10 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-3 text-xs text-slate-500 font-bold">
                  <span className="bg-indigo-100 text-indigo-705 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-black text-[9px]">ARTICLE</span>
                  <span>{selectedPost.date}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime}</span>
                </div>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="bg-slate-100 border border-black/10 hover:bg-slate-200 text-slate-805 text-slate-800 p-2 rounded-full active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="p-8 overflow-y-auto space-y-6 text-slate-700 bg-white">
                
                {/* Title */}
                <h2 className="font-poppins text-xl sm:text-2xl font-black text-[#030213] leading-tight">
                  {selectedPost.title}
                </h2>

                <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
                  <span>Written by:</span>
                  <span className="text-indigo-600 font-extrabold">{selectedPost.author}</span>
                  <span>| Child Pedagogy Consultant</span>
                </div>

                {/* Markdown format simulations */}
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium space-y-4 whitespace-pre-line border-t border-black/5 pt-6">
                  {selectedPost.content}
                </div>

              </div>

              {/* Footer Close */}
              <div className="p-5 border-t border-black/10 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="bg-[#030213] hover:bg-slate-800 text-white font-extrabold py-3 px-6 rounded-full text-xs tracking-wider uppercase active:scale-95 transition-all cursor-pointer"
                >
                  Close Article
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
