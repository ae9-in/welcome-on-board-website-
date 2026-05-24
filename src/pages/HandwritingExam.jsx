import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PenTool, Camera, Trash2, Undo2, CheckCircle, ArrowRight, Palette, Minus, Plus, RotateCcw, Upload, Eye, X, Award } from 'lucide-react';

// Grade-based writing/drawing prompts
const PROMPTS = {
  KG: {
    title: 'Draw a House',
    instruction: 'Draw a simple house with a door, window, and roof.',
    hint: 'Use the pencil tool to draw! Make it colorful and fun.',
    type: 'drawing',
  },
  Grade1_2: {
    title: 'Write Your Name',
    instruction: 'Write your full name neatly in big, clear letters.',
    hint: 'Use print letters. Make sure each letter is clear and separate.',
    type: 'handwriting',
  },
  Grade3_5: {
    title: 'Write a Sentence',
    instruction: 'Write this sentence: "The quick brown fox jumps over the lazy dog."',
    hint: 'Write clearly with proper spacing between words.',
    type: 'handwriting',
  },
  Grade6_8: {
    title: 'Write a Short Paragraph',
    instruction: 'Write 2–3 sentences about your favourite season and why you like it.',
    hint: 'Ensure neat, consistent letter sizes and even line spacing.',
    type: 'handwriting',
  },
  Grade9_10: {
    title: 'Cursive Handwriting',
    instruction: '"Education is the most powerful weapon which you can use to change the world." — Write this quote in your best cursive handwriting.',
    hint: 'Focus on smooth, connected cursive strokes and consistent slant.',
    type: 'handwriting',
  },
};

const getPrompt = (grade) => {
  if (grade === 'Kindergarten (KG)') return PROMPTS.KG;
  if (['1st Standard', '2nd Standard'].includes(grade)) return PROMPTS.Grade1_2;
  if (['3rd Standard', '4th Standard', '5th Standard'].includes(grade)) return PROMPTS.Grade3_5;
  if (['6th Standard', '7th Standard', '8th Standard'].includes(grade)) return PROMPTS.Grade6_8;
  return PROMPTS.Grade9_10;
};

const COLORS = ['#1e293b', '#1d4ed8', '#dc2626', '#15803d', '#7c3aed', '#d97706', '#ec4899'];
const STROKE_SIZES = [2, 4, 7, 12];

export default function HandwritingExam({ navigateTo, grade: propGrade, competition: propComp }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [grade, setGrade] = useState(propGrade || '');
  const [phase, setPhase] = useState('intro'); // intro | canvas | photo-preview | submitted
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // pen | eraser
  const [color, setColor] = useState('#1e293b');
  const [strokeSize, setStrokeSize] = useState(4);
  const [strokes, setStrokes] = useState([]); // for undo
  const [capturedImage, setCapturedImage] = useState(null);
  const [submissionMode, setSubmissionMode] = useState('canvas'); // canvas | photo
  const [showPreview, setShowPreview] = useState(false);
  const lastPoint = useRef(null);

  const grades = [
    'Kindergarten (KG)', '1st Standard', '2nd Standard', '3rd Standard',
    '4th Standard', '5th Standard', '6th Standard', '7th Standard',
    '8th Standard', '9th Standard', '10th Standard',
  ];

  const prompt = grade ? getPrompt(grade) : null;

  // ── Canvas Init ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw ruled lines for handwriting
    if (prompt?.type === 'handwriting') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let y = 60; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(canvas.width - 20, y);
        ctx.stroke();
      }
    }
  }, [phase, prompt]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const pos = getPos(e, canvas);
    lastPoint.current = pos;
    setIsDrawing(true);
    // Save snapshot for undo
    const ctx = canvas.getContext('2d');
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokes(prev => [...prev.slice(-19), snapshot]);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? strokeSize * 3 : strokeSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPoint.current = pos;
  }, [isDrawing, tool, color, strokeSize]);

  const endDraw = useCallback(() => setIsDrawing(false), []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (prompt?.type === 'handwriting') {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let y = 60; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(canvas.width - 20, y);
        ctx.stroke();
      }
    }
    setStrokes([]);
  };

  const undoLast = () => {
    if (strokes.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const last = strokes[strokes.length - 1];
    ctx.putImageData(last, 0, 0);
    setStrokes(prev => prev.slice(0, -1));
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCapturedImage(ev.target.result);
      setSubmissionMode('photo');
      setPhase('photo-preview');
    };
    reader.readAsDataURL(file);
  };

  const getCanvasImage = () => {
    const canvas = canvasRef.current;
    return canvas ? canvas.toDataURL('image/png') : null;
  };

  const handleSubmit = () => {
    const imageData = submissionMode === 'photo' ? capturedImage : getCanvasImage();
    // Save submission to localStorage
    const submissions = JSON.parse(localStorage.getItem('onboreding_submissions') || '[]');
    submissions.unshift({
      id: Date.now(),
      grade,
      comp: propComp || 'Handwriting Competition',
      type: submissionMode,
      image: imageData,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Under Review',
    });
    localStorage.setItem('onboreding_submissions', JSON.stringify(submissions.slice(0, 20)));
    setPhase('submitted');
  };

  // ── INTRO SCREEN ──────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#F6F7FA] py-16 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full text-indigo-700 font-bold text-xs tracking-widest uppercase">
              <PenTool className="w-4 h-4" />
              <span>{propComp || 'Handwriting & Drawing'}</span>
            </div>
            <h1 className="font-poppins text-4xl sm:text-5xl font-medium leading-[0.95] tracking-tighter text-[#030213]">
              {propComp || 'Creative Submission'}
            </h1>
            <p className="text-slate-600 font-medium text-sm max-w-md mx-auto">
              Write or draw on the digital canvas, or capture a photo of your physical work. Your task is tailored to your class level.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-900/5 border border-black/10 p-8 space-y-8">
            {/* Grade selector */}
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Select Your Class / Grade</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {grades.map(g => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                      grade === g
                        ? 'bg-[#030213] text-white border-black shadow-md shadow-slate-900/20 scale-105'
                        : 'bg-slate-50 text-slate-700 border-black/5 hover:border-black/20 hover:text-[#030213]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview prompt */}
            {grade && prompt && (
              <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <PenTool className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-700">Your Task</span>
                </div>
                <h3 className="font-poppins font-black text-lg text-[#030213]">{prompt.title}</h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">{prompt.instruction}</p>
                <p className="text-xs text-indigo-700/90 font-semibold italic">Tip: {prompt.hint}</p>
              </div>
            )}

            {/* Submission options */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { if (grade) { setSubmissionMode('canvas'); setPhase('canvas'); } }}
                disabled={!grade}
                className="flex flex-col items-center space-y-3 p-6 border border-black/10 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <PenTool className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="block font-poppins font-bold text-sm text-slate-800">Draw / Write Online</span>
                  <span className="text-xs text-slate-500">Use the digital canvas</span>
                </div>
              </button>
              <button
                onClick={() => { if (grade) fileInputRef.current?.click(); }}
                disabled={!grade}
                className="flex flex-col items-center space-y-3 p-6 border border-black/10 rounded-2xl hover:border-emerald-600 hover:bg-emerald-50/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="block font-poppins font-bold text-sm text-slate-800">Take a Photo</span>
                  <span className="text-xs text-slate-500">Submit physical work via camera</span>
                </div>
              </button>
            </div>

            {/* Hidden file input — opens camera on mobile, file picker on desktop */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoCapture}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── CANVAS SCREEN ─────────────────────────────────────────────────────────────
  if (phase === 'canvas') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Top toolbar */}
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-[#030213] p-1.5 rounded-lg border border-white/10">
                <PenTool className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="block text-white font-bold text-xs font-poppins">{prompt?.title}</span>
                <span className="block text-slate-400 text-[10px]">{grade}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {/* Tool */}
              <div className="flex bg-slate-700 rounded-xl p-1 space-x-1">
                <button onClick={() => setTool('pen')} className={`p-2 rounded-lg transition-colors cursor-pointer ${tool === 'pen' ? 'bg-[#030213] text-white border border-white/5' : 'text-slate-400 hover:text-white'}`}>
                  <PenTool className="w-4 h-4" />
                </button>
                <button onClick={() => setTool('eraser')} className={`p-2 rounded-lg transition-colors text-xs font-bold cursor-pointer ${tool === 'eraser' ? 'bg-slate-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                  <span className="px-1">✕</span>
                </button>
              </div>
              {/* Colors */}
              {tool === 'pen' && (
                <div className="flex items-center space-x-1">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${color === c ? 'border-white scale-125' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
              {/* Stroke */}
              <div className="flex items-center space-x-1 bg-slate-700 rounded-xl px-2 py-1">
                <Minus className="w-3 h-3 text-slate-400" />
                {STROKE_SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setStrokeSize(s)}
                    className={`rounded-full transition-all cursor-pointer ${strokeSize === s ? 'bg-indigo-500' : 'bg-slate-500'}`}
                    style={{ width: s * 2 + 4, height: s * 2 + 4 }}
                  />
                ))}
                <Plus className="w-3 h-3 text-slate-400" />
              </div>
              {/* Actions */}
              <button onClick={undoLast} disabled={strokes.length === 0} className="p-2 bg-slate-700 text-slate-400 hover:text-white rounded-xl disabled:opacity-30 transition-colors cursor-pointer">
                <Undo2 className="w-4 h-4" />
              </button>
              <button onClick={clearCanvas} className="p-2 bg-slate-700 text-slate-400 hover:text-red-400 rounded-xl transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Prompt banner */}
        <div className="bg-indigo-900 border-b border-indigo-950 px-4 py-2">
          <div className="max-w-5xl mx-auto">
            <p className="text-indigo-100 text-xs font-semibold text-center">{prompt?.instruction}</p>
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 flex items-start justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-black/10 overflow-hidden" style={{ height: '500px' }}>
            <canvas
              ref={canvasRef}
              className="w-full h-full touch-none cursor-crosshair"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="bg-slate-800 border-t border-slate-700 p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Upload Photo Instead</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoCapture}
              />
              <button
                onClick={() => { setShowPreview(true); }}
                className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            </div>
            <button
              onClick={() => { setSubmissionMode('canvas'); handleSubmit(); }}
              className="flex items-center space-x-2 bg-[#030213] border border-white/5 hover:opacity-90 text-white font-black px-8 py-3 rounded-full text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Submit My Work</span>
            </button>
          </div>
        </div>

        {/* Preview modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] overflow-hidden max-w-2xl w-full shadow-2xl border border-black/10">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="font-poppins font-bold text-[#030213]">Canvas Preview</h3>
                <button onClick={() => setShowPreview(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="p-4">
                <img src={getCanvasImage()} alt="Preview" className="w-full rounded-xl border border-black/10" />
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setShowPreview(false)} className="px-5 py-2 border border-black/10 rounded-full font-bold text-slate-700 text-sm hover:bg-slate-50 transition-all cursor-pointer">Edit More</button>
                <button onClick={() => { setShowPreview(false); handleSubmit(); }} className="px-5 py-2 bg-[#030213] hover:bg-slate-800 text-white rounded-full font-bold text-sm transition-all cursor-pointer">Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── PHOTO PREVIEW ─────────────────────────────────────────────────────────────
  if (phase === 'photo-preview' && capturedImage) {
    return (
      <div className="min-h-screen bg-[#F6F7FA] py-16 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-poppins font-black text-2xl text-[#030213]">Review Your Photo</h1>
            <p className="text-slate-500 text-sm font-medium">Check that your work is clearly visible before submitting.</p>
          </div>
          <div className="bg-white rounded-[2rem] overflow-hidden border border-black/10 shadow-xl shadow-slate-900/5">
            <img src={capturedImage} alt="Captured work" className="w-full max-h-[500px] object-contain" />
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
            <p className="text-sm font-semibold text-indigo-900">
              <strong>Task:</strong> {prompt?.instruction}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setCapturedImage(null); setPhase('intro'); }}
              className="flex items-center justify-center space-x-2 bg-white border border-black/10 text-slate-700 font-bold py-3.5 rounded-full hover:bg-slate-50 transition-all active:scale-95 text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Photo</span>
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center space-x-2 bg-[#030213] hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-full shadow-md active:scale-95 transition-all text-sm cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Submit Work</span>
            </button>
          </div>
          <button
            onClick={() => { setCapturedImage(null); setPhase('canvas'); }}
            className="w-full flex items-center justify-center space-x-2 text-indigo-600 font-semibold text-sm py-2 hover:underline cursor-pointer"
          >
            <PenTool className="w-4 h-4" />
            <span>Draw on Canvas Instead</span>
          </button>
        </div>
      </div>
    );
  }

  // ── SUCCESS / SUBMITTED ───────────────────────────────────────────────────────
  if (phase === 'submitted') {
    return (
      <div className="min-h-screen bg-[#F6F7FA] flex items-center justify-center py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-md">
            <CheckCircle className="w-14 h-14 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h1 className="font-poppins font-black text-3xl text-[#030213]">Submitted!</h1>
            <p className="text-slate-500 font-medium">Your {propComp || 'handwriting'} entry has been received and is now under review by our judges.</p>
          </div>
          <div className="bg-white border border-black/10 rounded-[2rem] p-6 shadow-xl shadow-slate-900/5 space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-500 border-b border-black/5 pb-4">
              <span>Grade:</span>
              <span className="font-black text-[#030213]">{grade}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-500 border-b border-black/5 pb-4">
              <span>Competition:</span>
              <span className="font-black text-indigo-600">{propComp || 'Handwriting Competition'}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
              <span>Status:</span>
              <span className="text-emerald-700 font-black bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs">Under Review</span>
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-2xl p-5 flex items-center space-x-3">
            <Award className="w-8 h-8 flex-shrink-0 text-indigo-700" />
            <div className="text-left">
              <span className="block font-black text-sm text-indigo-950">Results in 7–10 days!</span>
              <span className="text-xs text-indigo-700/80">Check the Results page for your certificate and rank.</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setPhase('intro'); setCapturedImage(null); setStrokes([]); }}
              className="flex items-center justify-center space-x-2 bg-white border border-black/10 text-slate-700 font-bold py-3 rounded-full text-sm hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Submit Again</span>
            </button>
            <button
              onClick={() => navigateTo('competitions')}
              className="flex items-center justify-center space-x-2 bg-violet-900 hover:bg-violet-950 text-white font-bold py-3 rounded-2xl text-sm shadow-lg active:scale-95 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              <span>All Contests</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
