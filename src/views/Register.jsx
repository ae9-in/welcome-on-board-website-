import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, AlertCircle, Sparkles, Landmark, Map, ArrowRight, Brain, PenTool } from 'lucide-react';

export default function Register({ selectedComp, setSelectedComp, navigateTo }) {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    grade: '',
    schoolName: '',
    location: '',
    competition: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [regDetails, setRegDetails] = useState(null);

  useEffect(() => {
    if (selectedComp) {
      setFormData(prev => ({ ...prev, competition: selectedComp }));
    }
  }, [selectedComp]);

  const grades = [
    'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4',
    'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11'
  ];

  const competitionsList = [
    'Quiz Competition', 'Spell Bee Competition', 'Math Challenge',
    'Art & Craft Competition', 'Handwriting Competition',
  ];

  const compToRoute = {
    'Quiz Competition': 'quiz',
    'Spell Bee Competition': 'spellbee',
    'Math Challenge': 'quiz',
    'Art & Craft Competition': 'art-craft',
    'Handwriting Competition': 'handwriting',
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.studentName.trim()) tempErrors.studentName = 'Student Name is required.';
    if (!formData.parentName.trim()) tempErrors.parentName = 'Parent or Guardian Name is required.';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email address syntax.';
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone Number is required.';
    } else if (!/^\+?[0-9]{8,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      tempErrors.phone = 'Enter a valid phone number.';
    }
    if (!formData.grade) tempErrors.grade = 'Please select Student Grade.';
    if (!formData.schoolName.trim()) tempErrors.schoolName = 'School Name is required.';
    if (!formData.location.trim()) tempErrors.location = 'City / State / Country details are required.';
    if (!formData.competition) tempErrors.competition = 'Please select a Competition.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem('onboreding_student_name', formData.studentName);
      const regs = JSON.parse(localStorage.getItem('onboreding_registrations') || '[]');
      const refNo = 'REG-' + Math.floor(100000 + Math.random() * 900000);
      regs.unshift({ ...formData, refNo, date: new Date().toISOString() });
      localStorage.setItem('onboreding_registrations', JSON.stringify(regs.slice(0, 20)));
      setRegDetails({ ...formData, refNo });
      setSubmitted(true);
      setSelectedComp('');
    }
  };

  const handleGoToComp = () => {
    const route = compToRoute[regDetails.competition] || 'competitions';
    navigateTo(route, { grade: regDetails.grade, comp: regDetails.competition, name: regDetails.studentName });
  };

  const handleCloseSuccess = () => {
    setSubmitted(false);
    setFormData({ studentName: '', parentName: '', email: '', phone: '', grade: '', schoolName: '', location: '', competition: '' });
    setRegDetails(null);
    navigateTo('competitions');
  };

  return (
    <div className="bg-[#F6F7FA] py-20 text-left min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full text-indigo-700 font-bold text-xs tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
            <span>Championship Open Enrollment</span>
          </div>
          <h2 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-tighter text-[#030213]">
            Contest Registration
          </h2>
          <p className="text-sm text-slate-600 font-semibold leading-relaxed max-w-lg mx-auto">
            Fill in the details below to secure your spot. Instantly unlock free printable preparation guides upon successful submission.
          </p>
        </div>

        {/* Form panel */}
        <div className="bg-white border border-black/10 rounded-[2rem] p-8 shadow-xl shadow-slate-900/5 relative overflow-hidden">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Student Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Student Name
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter student's full name"
                className={`w-full bg-white text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 placeholder-slate-400 font-semibold border ${
                  errors.studentName 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-black/10 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
              {errors.studentName && (
                <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.studentName}
                </span>
              )}
            </div>

            {/* Parent Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Parent / Guardian Name
              </label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="Enter parent's full name"
                className={`w-full bg-white text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 placeholder-slate-400 font-semibold border ${
                  errors.parentName 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-black/10 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
              {errors.parentName && (
                <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.parentName}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E.g. parent@email.com"
                  className={`w-full bg-white text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 placeholder-slate-400 font-semibold border ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-black/10 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                />
                {errors.email && (
                  <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="E.g. +1 (555) 019-2834"
                  className={`w-full bg-white text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 placeholder-slate-400 font-semibold border ${
                    errors.phone 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-black/10 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                />
                {errors.phone && (
                  <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {errors.phone}
                  </span>
                )}
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Grade */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Grade / Class
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className={`w-full bg-white text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 border font-semibold [&>option]:bg-white [&>option]:text-slate-850 ${
                    errors.grade 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-black/10 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                >
                  <option value="">-- Choose Grade --</option>
                  {grades.map((gr, index) => (
                    <option key={index} value={gr}>{gr}</option>
                  ))}
                </select>
                {errors.grade && (
                  <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {errors.grade}
                  </span>
                )}
              </div>

              {/* Competition selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Select Competition
                </label>
                <select
                  name="competition"
                  value={formData.competition}
                  onChange={handleChange}
                  className={`w-full bg-white text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 border font-semibold [&>option]:bg-white [&>option]:text-slate-850 ${
                    errors.competition 
                      ? 'border-red-500 focus:ring-red-500/20' 
                      : 'border-black/10 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                >
                  <option value="">-- Choose Competition --</option>
                  {competitionsList.map((comp, index) => (
                    <option key={index} value={comp}>{comp}</option>
                  ))}
                </select>
                {errors.competition && (
                  <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {errors.competition}
                  </span>
                )}
              </div>

            </div>

            {/* School Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center space-x-1.5">
                <Landmark className="w-3.5 h-3.5 text-indigo-600" />
                <span>School Name</span>
              </label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                placeholder="Enter school full name"
                className={`w-full bg-white text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 placeholder-slate-400 font-semibold border ${
                  errors.schoolName 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-black/10 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
              {errors.schoolName && (
                <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.schoolName}
                </span>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center space-x-1.5">
                <Map className="w-3.5 h-3.5 text-emerald-600" />
                <span>City / State / Country</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="E.g. Los Angeles, California, USA"
                className={`w-full bg-white text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 placeholder-slate-400 font-semibold border ${
                  errors.location 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-black/10 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
              {errors.location && (
                <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.location}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-[#030213] hover:bg-slate-800 text-white font-extrabold py-4 px-6 rounded-full shadow-md active:scale-95 transition-all text-xs sm:text-sm tracking-wider uppercase cursor-pointer"
            >
              <span>Submit Registration Form</span>
            </button>

          </form>
        </div>

        {/* Success Modal Confirmation popup */}
        {submitted && regDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full border-[12px] border-black relative overflow-hidden p-6 text-center space-y-6 animate-scale-up">
              
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200">
                <CheckCircle className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="font-poppins font-black text-xl text-[#030213]">Registration Success!</h3>
                <span className="inline-block text-[10px] text-emerald-700 font-bold uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                  Reference: {regDetails.refNo}
                </span>
              </div>

              {/* Summary table details */}
              <div className="bg-[#F6F7FA] border border-black/10 rounded-2xl p-4 text-xs font-semibold text-slate-600 space-y-3 text-left">
                <div className="flex justify-between">
                  <span>Student Name:</span>
                  <span className="text-[#030213] font-bold">{regDetails.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grade Level:</span>
                  <span className="text-[#030213] font-bold">{regDetails.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span>Competition:</span>
                  <span className="text-indigo-600 font-extrabold">{regDetails.competition}</span>
                </div>
                <div className="flex justify-between border-t border-black/5 pt-2.5">
                  <span>School:</span>
                  <span className="text-[#030213] font-bold truncate max-w-[200px]">{regDetails.schoolName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-[#030213] font-bold truncate max-w-[200px]">{regDetails.location}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-semibold">
                Ready to compete? Click below to start your competition now!
              </p>

              <button
                onClick={handleGoToComp}
                className="w-full flex items-center justify-center space-x-2 bg-[#030213] hover:bg-slate-800 text-white font-extrabold py-4 px-6 rounded-full transition-all active:scale-95 text-xs sm:text-sm tracking-wider shadow-md cursor-pointer"
              >
                <Brain className="w-5 h-5" />
                <span>Start Competition Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleCloseSuccess}
                className="w-full bg-white border border-black/10 hover:bg-slate-50 text-slate-700 font-bold py-3 px-6 rounded-full transition-all active:scale-95 text-xs tracking-wider cursor-pointer"
              >
                View All Competitions
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
