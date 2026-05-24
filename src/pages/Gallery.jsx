import React, { useState } from 'react';
import {
  Eye, Heart, Star, Sparkles, Filter, Palette, PenTool,
  Trophy, Scissors, FileText, Medal, Upload, Camera, Trash2, X, Plus
} from 'lucide-react';

export default function Gallery({ activeFigurineBg }) {
  const defaultItems = [
    {
      id: 1,
      title: 'Majestic Forest Canvas',
      category: 'art',
      student: 'Mia Carter',
      grade: 'Grade 2',
      details: 'Acrylic painting on handmade paper.',
      likes: 245,
      image: '/gallery_forest.png',
      bgGradient: 'from-pink-50 to-rose-100'
    },
    {
      id: 2,
      title: 'Neat Cursive Penmanship',
      category: 'handwriting',
      student: 'Aditya Deshmukh',
      grade: 'Grade 8',
      details: 'Perfect cursive stroke alignment sample.',
      likes: 189,
      image: '/gallery_cursive.png',
      bgGradient: 'from-blue-50 to-indigo-100'
    },
    {
      id: 3,
      title: 'Shining Trophy Winners',
      category: 'winners',
      student: 'Sneha & Rohan',
      grade: 'Grades 5 & 4',
      details: 'National Rank holders celebrating with Gold Medals.',
      likes: 412,
      image: '/gallery_winners.png',
      bgGradient: 'from-amber-50 to-orange-100'
    },
    {
      id: 4,
      title: 'Origami Bird Showcase',
      category: 'art',
      student: 'Karan Mehra',
      grade: 'Grade 6',
      details: '3D model paper crafts and color layout.',
      likes: 156,
      image: '/gallery_origami.png',
      bgGradient: 'from-teal-50 to-emerald-100'
    },
    {
      id: 5,
      title: 'Symmetrical Alphabet Handwriting',
      category: 'handwriting',
      student: 'Priya Sen',
      grade: 'Grade 3',
      details: 'Neat print letters copywriting sheet.',
      likes: 213,
      image: '/gallery_symmetrical.png',
      bgGradient: 'from-violet-50 to-purple-100'
    },
    {
      id: 6,
      title: 'Gold Medal Ceremony',
      category: 'winners',
      student: 'Junior Champions',
      grade: 'KG to Grade 3',
      details: 'Happy participants holding certificates of excellence.',
      likes: 354,
      image: '/gallery_gold.png',
      bgGradient: 'from-amber-50 to-yellow-100'
    }
  ];

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('onboreding_gallery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge the new defaultItems (with image paths) with the likes from localStorage
        const mergedDefault = defaultItems.map(d => {
          const match = parsed.find(p => p.id === d.id);
          if (match) {
            return { ...d, likes: match.likes };
          }
          return d;
        });
        // Filter out any custom user uploads (they have ids not matching default items)
        const customUploads = parsed.filter(p => !defaultItems.some(d => d.id === p.id));
        return [...mergedDefault, ...customUploads];
      } catch (e) {
        return defaultItems;
      }
    }
    return defaultItems;
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [newEntry, setNewEntry] = useState({
    title: '',
    student: '',
    grade: 'Grade 1',
    category: 'art',
    image: '',
    details: ''
  });

  const handleLike = (id) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    setItems(updated);
    localStorage.setItem('onboreding_gallery', JSON.stringify(updated.map(i => {
      const { icon, ...rest } = i;
      return rest;
    })));
  };

  const handleDelete = (id) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem('onboreding_gallery', JSON.stringify(updated.map(i => {
      const { icon, ...rest } = i;
      return rest;
    })));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setUploadError('Image size should be less than 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEntry(prev => ({ ...prev, image: reader.result }));
        setUploadError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newEntry.student.trim()) {
      setUploadError('Student name is required.');
      return;
    }
    if (!newEntry.title.trim()) {
      setUploadError('Artwork title is required.');
      return;
    }
    if (!newEntry.image) {
      setUploadError('Please upload or capture a photo.');
      return;
    }

    const createdItem = {
      id: Date.now(),
      title: newEntry.title,
      category: newEntry.category,
      student: newEntry.student,
      grade: newEntry.grade,
      details: newEntry.details || 'Championship Series entry.',
      likes: 0,
      image: newEntry.image,
      bgGradient: 'from-indigo-50 to-blue-100'
    };

    const updated = [createdItem, ...items];
    setItems(updated);
    localStorage.setItem('onboreding_gallery', JSON.stringify(updated.map(i => {
      const { icon, ...rest } = i;
      return rest;
    })));

    setNewEntry({
      title: '',
      student: '',
      grade: 'Grade 1',
      category: 'art',
      image: '',
      details: ''
    });
    setShowUploadForm(false);
    setUploadError('');
  };

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter(item => item.category === activeFilter);

  return (
    <div className="bg-[#F6F7FA] py-20 text-left min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 relative">
          <span className="text-xs font-black tracking-widest text-indigo-650 text-indigo-600 uppercase font-poppins font-bold">Hall of Fame</span>
          <h2 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-tighter text-[#030213]">
            Student Showcase Gallery
          </h2>
          <p className="text-sm text-slate-655 text-slate-600 font-semibold leading-relaxed">
            Witness the incredible imagination and precision of our young contestants! Upload your own achievements to share with the community.
          </p>

          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="inline-flex items-center space-x-2 bg-[#030213] hover:bg-slate-800 text-white font-extrabold py-3.5 px-8 rounded-full shadow-md hover:scale-[1.02] active:scale-95 transition-all text-xs tracking-wider uppercase mt-6 focus:outline-none cursor-pointer"
          >
            {showUploadForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 font-black" />}
            <span>{showUploadForm ? 'Close Upload Desk' : 'Upload Your Artwork'}</span>
          </button>
        </div>

        {/* Upload Form Box */}
        {showUploadForm && (
          <div className="mb-12 max-w-2xl mx-auto bg-white rounded-[2rem] border border-black/10 shadow-2xl overflow-hidden p-8 animate-scale-up">
            <h3 className="font-poppins font-black text-xl text-[#030213] mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" />
              <span>Submit to the Hall of Fame</span>
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newEntry.student}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, student: e.target.value }))}
                    placeholder="Enter student name"
                    className="w-full bg-white border border-black/10 text-slate-800 rounded-xl py-3.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 font-semibold shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Artwork Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter title of work"
                    className="w-full bg-white border border-black/10 text-slate-800 rounded-xl py-3.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 font-semibold shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Contest Category
                  </label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white border border-black/10 text-slate-800 rounded-xl py-3.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold shadow-sm [&>option]:bg-white [&>option]:text-slate-850"
                  >
                    <option value="art">Art & Craft</option>
                    <option value="handwriting">Handwriting</option>
                    <option value="winners">Winners / Trophies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Grade level
                  </label>
                  <select
                    value={newEntry.grade}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full bg-white border border-black/10 text-slate-800 rounded-xl py-3.5 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold shadow-sm [&>option]:bg-white [&>option]:text-slate-850"
                  >
                    <option value="KG">Kindergarten (KG)</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={`Grade ${i + 1}`}>{`Grade ${i + 1}`}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Short Description
                </label>
                <textarea
                  value={newEntry.details}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="Describe your design (colors, tools used, certificates received)"
                  rows={2}
                  className="w-full bg-white border border-black/10 text-slate-800 rounded-xl py-3 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 font-semibold shadow-sm"
                />
              </div>

              {/* Image Input Container */}
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Upload file or Snap Photo
                </label>
                <div className="flex items-center justify-center border-2 border-dashed border-black/15 rounded-[1.5rem] p-6 bg-[#F6F7FA] hover:bg-slate-100 transition-colors relative">
                  {newEntry.image ? (
                    <div className="relative w-full max-h-[250px] overflow-hidden rounded-2xl">
                      <img src={newEntry.image} alt="Preview" className="w-full h-full object-contain max-h-[250px]" />
                      <button
                        type="button"
                        onClick={() => setNewEntry(prev => ({ ...prev, image: '' }))}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 bg-white text-slate-600 rounded-full flex items-center justify-center mx-auto border border-black/10">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="text-slate-500 text-xs font-semibold">
                        <span>Click to snap photo or select file</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {uploadError && (
                <div className="text-red-600 text-xs font-semibold flex items-center gap-1.5 bg-red-50 border border-red-200 p-3.5 rounded-xl">
                  <span>⚠️ {uploadError}</span>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#030213] hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-full active:scale-95 transition-all text-xs tracking-wider uppercase shadow-md cursor-pointer"
                >
                  Publish to Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="bg-white border border-black/10 text-slate-700 hover:bg-slate-50 font-bold py-3.5 px-6 rounded-full text-xs sm:text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {[
            { id: 'all', label: 'All Submissions' },
            { id: 'art', label: 'Art & Craft', icon: Palette, iconColor: 'text-pink-500' },
            { id: 'handwriting', label: 'Handwriting', icon: PenTool, iconColor: 'text-indigo-500' },
            { id: 'winners', label: 'Winners', icon: Trophy, iconColor: 'text-amber-500' }
          ].map(btn => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setActiveFilter(btn.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide border transition-all flex items-center gap-2 cursor-pointer ${activeFilter === btn.id
                  ? 'bg-[#030213] text-white border-[#030213] shadow-md'
                  : 'bg-white text-slate-600 border-black/10 hover:border-black/20 hover:text-[#030213] hover:bg-slate-50'
                  }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${activeFilter === btn.id ? 'text-white' : btn.iconColor}`} />}
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white border border-black/10 rounded-[2rem] max-w-md mx-auto shadow-xl shadow-slate-900/5 space-y-3">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-poppins font-black text-[#030213] text-lg">No entries yet!</h3>
            <p className="text-slate-500 text-xs font-semibold px-6 leading-relaxed">
              Be the first to upload an entry for this category by clicking "Upload Your Artwork" above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="group bg-white border border-black/10 hover:border-black/20 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-305 duration-300 flex flex-col justify-between hover:scale-[1.015]"
              >

                {/* Visual Panel */}
                <div className={`h-64 bg-gradient-to-tr ${item.bgGradient || 'from-indigo-50 to-blue-100'} flex items-center justify-center relative overflow-hidden`}>
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-white/85 backdrop-blur-md text-[10px] text-slate-800 border border-black/10 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                    {item.category === 'art' ? 'Art & Craft' : item.category === 'handwriting' ? 'Handwriting' : 'Champion'}
                  </div>

                  {/* Render Image or Icon */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="filter drop-shadow-md transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {item.icon && <item.icon className={`w-20 h-20 ${item.iconColor}`} />}
                    </div>
                  )}

                  {/* Submissions verification badge */}
                  <div className="absolute bottom-4 right-4 z-10 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-black/10 text-[9px] text-slate-800 font-black tracking-widest uppercase">
                    Verified Entry
                  </div>

                  {/* Trash Button for Custom Uploads */}
                  {item.id > 100 && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm text-red-650 text-red-650 hover:bg-red-600 hover:text-white border border-black/10 p-2 rounded-xl transition-all shadow-sm focus:outline-none cursor-pointer"
                      title="Remove Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Body details */}
                <div className="p-6 space-y-4 bg-white">
                  <div className="space-y-1">
                    <h3 className="font-poppins font-extrabold text-lg text-[#030213] group-hover:text-indigo-600 transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <span className="block text-xs font-bold text-indigo-600">
                      By {item.student} ({item.grade})
                    </span>
                  </div>
                  <p className="text-xs text-slate-655 text-slate-600 font-semibold leading-relaxed">
                    {item.details}
                  </p>
                  <div className="flex items-center justify-between border-t border-black/5 pt-4 text-xs font-bold text-slate-400">
                    <button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center space-x-1.5 text-slate-500 hover:text-rose-600 transition-colors group/like focus:outline-none cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500 group-hover/like:scale-125 transition-transform" />
                      <span>{item.likes} Likes</span>
                    </button>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-extrabold uppercase">
                      Championship Series
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
