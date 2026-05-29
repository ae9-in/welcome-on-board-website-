import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Student or Parent Name is required.';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email address syntax.';
    }

    if (!formData.subject.trim()) tempErrors.subject = 'Subject cannot be empty.';
    if (!formData.message.trim()) tempErrors.message = 'Message body is required.';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 4000);
    }
  };

  return (
    <div className="bg-[#F6F7FA] py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black tracking-widest text-indigo-600 uppercase font-poppins">Get Support</span>
          <h2 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.95] tracking-tighter text-[#030213]">
            Let's Keep in Touch!
          </h2>
          <p className="text-sm text-slate-655 text-slate-600 font-semibold leading-relaxed">
            Have queries about competition guidelines, evaluation criteria, or physical trophy deliveries? Drop us a line below or reach out via WhatsApp support desk!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* 1. Contact Information Panel */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* WhatsApp card */}
              <a 
                href="https://api.whatsapp.com/send?phone=18005559876&text=Hello%20OnBoarding%20Support!"
                target="_blank"
                rel="noreferrer"
                className="block bg-emerald-50 border border-emerald-205 border-emerald-200 p-6 rounded-[2rem] hover:bg-emerald-100/50 transition-all text-left shadow-xl shadow-slate-900/5"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                    <MessageSquare className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-base text-emerald-805 text-emerald-800">Chat on WhatsApp</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Quick responses for rule sheets.</p>
                    <span className="block text-emerald-700 font-bold text-sm mt-2 font-poppins">+1 (800) 555-9876</span>
                  </div>
                </div>
              </a>

              {/* General support */}
              <div className="bg-white border border-black/10 p-6 rounded-[2rem] shadow-xl shadow-slate-900/5 text-left">
                <div className="space-y-6 text-sm">
                  
                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F6F7FA] text-slate-800 flex items-center justify-center border border-black/5 flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Direct Hotline</span>
                      <a href="tel:+18005559876" className="text-[#030213] hover:text-indigo-600 font-bold font-poppins">+1 (800) 555-9876</a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F6F7FA] text-slate-800 flex items-center justify-center border border-black/5 flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Email Support</span>
                      <a href="mailto:support@onboarding.com" className="text-[#030213] hover:text-indigo-600 font-bold font-poppins">support@onboarding.com</a>
                    </div>
                  </div>

                  {/* Office */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F6F7FA] text-slate-800 flex items-center justify-center border border-black/5 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Global Head Office</span>
                      <span className="text-[#030213] font-bold font-poppins">100 Academic Circle, San Francisco, CA, USA</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Simulated Modern Map Element */}
            <div className="bg-slate-50 border border-black/10 text-slate-800 rounded-[2rem] p-6 relative overflow-hidden shadow-xl shadow-slate-900/5 h-48 flex flex-col justify-between">
              <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full animate-ping z-10" />
              <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full z-10" />
              
              <div className="relative z-10 text-left">
                <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-black">Interactive Workspace Map</span>
                <h4 className="font-poppins font-black text-sm text-[#030213] mt-1">OnBoarding HQ Campus</h4>
                <p className="text-[11px] text-slate-550 text-slate-500 mt-0.5">San Francisco, California</p>
              </div>

              <div className="relative z-10 text-[10px] text-indigo-700 bg-white py-2 px-3 rounded-xl border border-black/10 self-start flex items-center space-x-1.5 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Digital Geo-Code: 37.7749° N, 122.4194° W</span>
              </div>
            </div>

          </div>

          {/* 2. Interactive Validated Form */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] shadow-xl shadow-slate-900/5 border border-black/10 p-8 text-left">
            <h3 className="font-poppins font-extrabold text-xl text-[#030213] mb-6 border-b border-black/5 pb-4 flex items-center space-x-2">
              <span>Send Us a Message</span>
            </h3>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200">
                  <CheckCircle className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="font-poppins font-black text-lg text-[#030213]">Thank You For Writing!</h3>
                <p className="text-xs text-slate-500 font-semibold max-w-sm">
                  Our academic help desk has successfully logged your ticket. We will email a response in less than 24 hours!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Name (Parent / Student)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`w-full bg-white text-slate-805 text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 placeholder-slate-400 font-semibold border ${
                      errors.name 
                        ? 'border-red-500 focus:ring-red-550/20 focus:ring-red-500/20' 
                        : 'border-black/10 focus:ring-indigo-505 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  />
                  {errors.name && (
                    <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      {errors.name}
                    </span>
                  )}
                </div>

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
                    placeholder="Enter email address"
                    className={`w-full bg-white text-slate-805 text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 placeholder-slate-400 font-semibold border ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-550/20 focus:ring-red-500/20' 
                        : 'border-black/10 focus:ring-indigo-505 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  />
                  {errors.email && (
                    <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="E.g. Registration doubt, Trophy delivery details"
                    className={`w-full bg-white text-slate-805 text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 placeholder-slate-400 font-semibold border ${
                      errors.subject 
                        ? 'border-red-500 focus:ring-red-550/20 focus:ring-red-500/20' 
                        : 'border-black/10 focus:ring-indigo-505 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  />
                  {errors.subject && (
                    <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      {errors.subject}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type details here..."
                    className={`w-full bg-white text-slate-805 text-slate-800 py-3.5 px-4.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 resize-none placeholder-slate-400 font-semibold border ${
                      errors.message 
                        ? 'border-red-500 focus:ring-red-550/20 focus:ring-red-500/20' 
                        : 'border-black/10 focus:ring-indigo-505 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                  />
                  {errors.message && (
                    <span className="flex items-center text-red-600 text-xs font-semibold mt-2.5">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 bg-[#030213] hover:bg-slate-805 hover:bg-slate-800 text-white font-extrabold py-4 px-6 rounded-full shadow-md active:scale-95 transition-all text-xs tracking-wider uppercase cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message Now</span>
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
