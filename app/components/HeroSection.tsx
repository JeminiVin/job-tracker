'use client';

import React from 'react';
import { Navbar } from './Navbar';

interface HeroSectionProps {
  activeTab: 'home' | 'app';
  setActiveTab: (tab: 'home' | 'app') => void;
  onOpenModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ activeTab, setActiveTab, onOpenModal }) => {
  return (
    <div className="bg-gradient-to-r from-[#D83B68] via-[#A83279] to-[#632C84] text-white relative overflow-hidden min-h-[580px] flex flex-col justify-between">
      {/* Right Portrait Image Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 pointer-events-none opacity-30 lg:opacity-75 mix-blend-screen overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80" 
          alt="MediaJel Style Overlay" 
          className="w-full h-full object-cover object-center filter contrast-125 brightness-90 hue-rotate-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#A83279] via-transparent to-transparent hidden lg:block" />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onOpenModal={onOpenModal} />

      {activeTab === 'home' && (
        <div className="max-w-7xl mx-auto px-6 py-16 w-full z-10 my-auto">
          <div className="max-w-2xl space-y-6 text-left">
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.08] text-white">
              Captivate Audiences <br />
              <span className="text-amber-300">Cultivate Customers</span>
            </h1>

            <p className="text-base sm:text-lg text-rose-100/90 font-normal leading-relaxed max-w-xl">
              Create meaningful consumer connections across every device, media channel, and geography with custom-built Next.js tracking & SaaS solutions.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('app')}
                className="bg-[#F59E0B] hover:bg-amber-400 text-slate-950 px-8 py-3.5 rounded-md font-black text-xs uppercase tracking-widest transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                Start Tracking Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};