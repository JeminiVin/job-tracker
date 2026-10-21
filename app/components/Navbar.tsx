'use client';

import React from 'react';

interface NavbarProps {
  activeTab: 'home' | 'app';
  setActiveTab: (tab: 'home' | 'app') => void;
  onOpenModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenModal }) => {
  return (
    <nav className="max-w-7xl mx-auto px-6 h-20 w-full flex items-center justify-between z-20">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
        <span className="text-2xl font-black tracking-widest uppercase text-white">
          TRACK<span className="text-amber-300">FLOW</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-white/90">
        <button 
          onClick={() => setActiveTab('home')} 
          className={`hover:text-amber-300 transition-colors ${activeTab === 'home' ? 'text-amber-300 underline underline-offset-8 decoration-2' : ''}`}
        >
          Who We Help
        </button>
        <button 
          onClick={() => setActiveTab('app')} 
          className={`hover:text-amber-300 transition-colors ${activeTab === 'app' ? 'text-amber-300 underline underline-offset-8 decoration-2' : ''}`}
        >
          Job Dashboard
        </button>
        <button onClick={() => setActiveTab('home')} className="hover:text-amber-300 transition-colors">
          How It Works
        </button>
        <button onClick={() => setActiveTab('home')} className="hover:text-amber-300 transition-colors">
          Why TrackFlow
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setActiveTab('app')}
          className="text-xs font-bold uppercase text-white hover:text-amber-300 px-3 py-2 transition-colors"
        >
          Log In
        </button>
        <button
          onClick={() => {
            setActiveTab('app');
            onOpenModal();
          }}
          className="bg-[#F59E0B] hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-md font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          Let's Connect
        </button>
      </div>
    </nav>
  );
};