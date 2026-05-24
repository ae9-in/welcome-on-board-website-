import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function WhatsAppButton() {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'agent', text: 'Hi there! Welcome to OnBoarding.' },
    { sender: 'agent', text: 'Have questions about registrations or competition rules? Type below to chat on WhatsApp!' }
  ]);

  useEffect(() => {
    // Show popup after 3 seconds for engagement, once per reload
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMsg = message;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setMessage('');

    // Open whatsapp external window pre-filled after a brief delay
    setTimeout(() => {
      const whatsappUrl = `https://api.whatsapp.com/send?phone=18005559876&text=${encodeURIComponent(userMsg)}`;
      window.open(whatsappUrl, '_blank');
      
      // Auto response in bubble
      setChatHistory(prev => [...prev, { 
        sender: 'agent', 
        text: 'Opening WhatsApp chat to connect with our support desk...' 
      }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Interactive Chat Popup */}
      {showPopup && (
        <div className="mb-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-300 animate-bounce-slow">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-800 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white shadow-inner">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h4 className="font-poppins font-bold text-sm leading-tight text-white">OnBoarding Help Desk</h4>
                <span className="text-[10px] text-slate-300 font-medium">Online • Responds Instantly</span>
              </div>
            </div>
            <button 
              onClick={() => setShowPopup(false)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat content */}
          <div className="p-4 space-y-3 h-48 overflow-y-auto bg-slate-50 text-xs">
            {chatHistory.map((chat, idx) => (
              <div 
                key={idx} 
                className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                    chat.sender === 'user' 
                      ? 'bg-blue-900 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Form Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-slate-100 text-xs text-slate-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 border-none"
            />
            <button 
              type="submit"
              className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Pulse WhatsApp Launcher */}
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20 active:scale-95 transition-all transform hover:rotate-12 duration-200"
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
      </button>
    </div>
  );
}
