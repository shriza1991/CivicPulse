import React, { useState } from 'react';
import { Mic, Sparkles, MapPin, Image, MessageSquare, Globe, ArrowRight } from 'lucide-react';
import { WhatsAppReportBanner } from '../../../components/issue/WhatsAppReportBanner';
import { VoiceRecorderModal } from '../../../components/issue/VoiceRecorderModal';
import type { VoiceAnalysisResult } from '../../../components/issue/VoiceRecorderModal';

export interface LandingHeroProps {
  onStartReport: (initialMode?: 'voice' | 'text' | 'photo') => void;
  onBrowseMap?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartReport, onBrowseMap }) => {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');

  const handleVoiceConfirm = (_audioFile: File, _analysis: VoiceAnalysisResult) => {
    setIsVoiceOpen(false);
    onStartReport('voice');
  };

  return (
    <div className="space-y-5 font-sans py-2">
      {/* Primary Voice-First Hero Action Card */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-teal-900 via-primary-900 to-neutral-950 rounded-2xl text-white shadow-2xl relative overflow-hidden border border-teal-800/50">
        <div className="relative z-10 space-y-5 max-w-2xl">
          {/* Top Badge & Language Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold backdrop-blur-xs border border-teal-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>India-First Community Demand Intelligence</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-teal-200/90 bg-black/30 px-3 py-1 rounded-full border border-white/10">
              <Globe className="w-3.5 h-3.5 text-teal-300" />
              <span>Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="auto" className="text-neutral-900">Auto-Detect</option>
                <option value="hi" className="text-neutral-900">हिन्दी (Hindi)</option>
                <option value="mr" className="text-neutral-900">मराठी (Marathi)</option>
                <option value="kn" className="text-neutral-900">ಕನ್ನಡ (Kannada)</option>
                <option value="ta" className="text-neutral-900">தமிழ் (Tamil)</option>
                <option value="bn" className="text-neutral-900">বাংলা (Bengali)</option>
                <option value="en" className="text-neutral-900">English</option>
              </select>
            </div>
          </div>

          {/* Hero Heading */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-teal-300 font-bold">
              Citizen Voice & Need Intake
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              WHAT DOES YOUR COMMUNITY NEED?
            </h1>
            <p className="text-sm text-teal-100/90 leading-relaxed max-w-xl">
              Speak or describe your neighbourhood's water, drainage, road, or healthcare needs. CommonGround fuses citizen voices with Indian demographic and infrastructure data to generate evidence-backed priorities for planners.
            </p>
          </div>

          {/* Primary Action Buttons: Large Microphone Hero Button */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-teal-900/50 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span className="p-1.5 rounded-lg bg-white/20">
                <Mic className="w-5 h-5 animate-pulse" />
              </span>
              <span>Speak Your Community Need</span>
            </button>

            <button
              type="button"
              onClick={() => onStartReport('text')}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-xs border border-white/15 transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-teal-300" />
              <span>Type instead</span>
            </button>

            <button
              type="button"
              onClick={() => onStartReport('photo')}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-xs border border-white/15 transition cursor-pointer"
            >
              <Image className="w-4 h-4 text-teal-300" />
              <span>Add photo</span>
            </button>

            <a
              href="https://wa.me/919876543210?text=Hi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-xl backdrop-blur-xs border border-emerald-400/30 transition cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              <span>Report on WhatsApp</span>
            </a>

            {onBrowseMap && (
              <button
                type="button"
                onClick={onBrowseMap}
                className="inline-flex items-center gap-1.5 px-3.5 py-3 text-teal-200 hover:text-white text-xs font-semibold transition cursor-pointer ml-auto"
              >
                <MapPin className="w-4 h-4 text-teal-300" />
                <span>Explore Map Hotspots</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <Sparkles className="absolute -right-8 -bottom-8 w-56 h-56 text-white/5 pointer-events-none" />
      </div>

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onConfirm={handleVoiceConfirm}
      />

      {/* Instant WhatsApp alternative entry banner */}
      <WhatsAppReportBanner />
    </div>
  );
};
