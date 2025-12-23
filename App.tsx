import React, { useState, useEffect } from 'react';
import { Background } from './components/Background';
import { AdSpace } from './components/AdSpace';
import { analyzeUrl } from './services/geminiService';
import { AppStatus, VideoMetadata } from './types';
import { ResultCard } from './components/ResultCard';
import { AlertTriangleIcon, ArrowRightIcon } from './components/Icons';
import { ScrollReveal } from './components/ScrollReveal';
import { OfflinePage } from './components/OfflinePage';

export default function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  useEffect(() => {
    // 1. Network status listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus(AppStatus.ANALYZING);
    setError(null);
    setMetadata(null);

    try {
      const result = await analyzeUrl(url);
      if (result.platform === 'Unknown') {
        throw new Error("Could not detect a supported platform (YouTube or Instagram).");
      }
      setMetadata(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  // Immediate return if offline
  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <div className="min-h-screen text-white font-sans selection:bg-vite-purple/30 selection:text-white flex flex-col">
      <Background />
      
      {/* Navbar */}
      <nav className="h-20 border-b border-white/5 bg-vite-dark/60 backdrop-blur-xl fixed top-0 w-full z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {
            setStatus(AppStatus.IDLE);
            setUrl('');
            setMetadata(null);
          }}>
             <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-vite-cyan to-vite-purple rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-full h-full bg-vite-surface rounded-xl flex items-center justify-center font-bold text-xl border border-white/10">
                  A
                </div>
             </div>
             <span className="font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-vite-cyan group-hover:to-vite-purple transition-all duration-300">
               Aether<span className="text-gray-400 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-vite-cyan group-hover:to-vite-purple">Load</span>
             </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-gray-400 hidden lg:block px-4 py-2 rounded-full border border-white/5 bg-white/5 transition-all duration-300 hover:border-vite-cyan/50 hover:text-vite-cyan hover:bg-vite-cyan/5 hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] cursor-default select-none">
              Universal Media Downloader
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <div className="flex-1 pt-20 flex flex-col md:flex-row">
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative">
          <div className="flex-1 px-4 py-16 md:py-24 flex flex-col items-center max-w-5xl mx-auto w-full z-10">
            
            {/* Hero Section - Hidden when SUCCESS */}
            {status !== AppStatus.SUCCESS && (
              <ScrollReveal className="text-center space-y-8 transition-all duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vite-purple/10 border border-vite-purple/20 text-vite-purple text-xs font-semibold tracking-wider uppercase mb-4">
                  <span className="w-2 h-2 rounded-full bg-vite-cyan animate-pulse"></span>
                  Connected to Live Internet
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]">
                  <span className="vite-gradient-text">Ultra-Fast</span><br />
                  <span className="text-white">Media Saver</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Experience the next generation of media downloading. Support for 4K video, Reels, Shorts, and Photos from your favorite platforms.
                </p>
              </ScrollReveal>
            )}

            {/* Input Form */}
            <ScrollReveal delay={200} className={`w-full max-w-2xl relative group z-20 transition-all duration-500 ${status === AppStatus.SUCCESS ? 'mt-0' : 'mt-16'}`}>
              <div className="absolute -inset-1 bg-gradient-to-r from-vite-cyan via-vite-purple to-vite-blue rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <form onSubmit={handleSubmit} className="relative flex items-center bg-vite-surface rounded-2xl p-2 ring-1 ring-white/10 shadow-2xl transition-transform duration-300 focus-within:scale-[1.01]">
                <input
                  type="text"
                  placeholder="Paste YouTube or Instagram link here..."
                  className="flex-1 bg-transparent border-none outline-none text-white px-6 py-4 placeholder:text-gray-600 text-lg font-medium"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={status === AppStatus.ANALYZING}
                  className="bg-white text-black hover:bg-vite-cyan hover:text-black px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  {status === AppStatus.ANALYZING ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                      Searching
                    </span>
                  ) : (
                    <>
                      Start <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </ScrollReveal>

            {/* Error Message */}
            {status === AppStatus.ERROR && error && (
              <ScrollReveal delay={100} className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
                <AlertTriangleIcon className="w-5 h-5" />
                {error}
              </ScrollReveal>
            )}

            {/* Result Display */}
            {status === AppStatus.SUCCESS && metadata && (
              <ResultCard metadata={metadata} />
            )}

            {/* Features (Only visible when IDLE) */}
            {status === AppStatus.IDLE && (
              <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {[
                  { title: 'Live Search', desc: 'Analyzes live internet data to find the most accurate video metadata and thumbnails.' },
                  { title: 'High Fidelity', desc: 'Crystal clear 4K resolution support and high-bitrate audio extraction.' },
                  { title: 'Privacy First', desc: 'No registration required. We do not store your data. Secure & Free forever.' }
                ].map((feature, i) => (
                  <ScrollReveal key={i} delay={400 + (i * 100)} direction="up">
                    <div className="h-full p-8 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-vite-purple/30 hover:bg-white/[0.05] transition-all duration-500 group">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-vite-dark to-vite-surface border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <span className="text-vite-purple font-bold text-lg">{i + 1}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-vite-cyan transition-colors">{feature.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Ad Bar */}
          <ScrollReveal delay={800} className="h-24 md:h-32 w-full p-6 mt-auto">
             <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl shadow-black/50">
                <AdSpace position="bottom" />
             </div>
          </ScrollReveal>

          {/* Minimalist Tech Footer - Without OS Info */}
          <div className="w-full border-t border-white/5 bg-[#050507] p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600 select-none backdrop-blur-md z-30">
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5">
                   <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'} animate-pulse`}></div>
                   <span className="text-gray-400">{isOnline ? 'System Ready' : 'Offline Mode'}</span>
                </div>
             </div>
             
             <div className="flex items-center gap-2 group cursor-help transition-all duration-300">
                <span className="opacity-40 group-hover:opacity-100 transition-opacity">Engineered by</span>
                <span className="relative px-2 py-0.5">
                   <span className="absolute inset-0 bg-gradient-to-r from-vite-cyan/20 to-vite-purple/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"></span>
                   <span className="relative font-bold bg-gradient-to-r from-gray-500 to-gray-500 group-hover:from-vite-cyan group-hover:to-vite-purple bg-clip-text text-transparent transition-all duration-300">
                      NEXUS_DEV_01
                   </span>
                </span>
             </div>
          </div>

        </main>

        {/* Sidebar Ad (Hidden on mobile, visible on lg screens) */}
        <aside className="hidden lg:block w-[320px] bg-[#050507] border-l border-white/5 p-6 z-20">
          <ScrollReveal delay={1000} direction="left" className="h-full sticky top-24">
            <div className="h-full rounded-xl overflow-hidden border border-white/5 shadow-2xl shadow-black">
               <AdSpace position="sidebar" />
            </div>
          </ScrollReveal>
        </aside>

      </div>
    </div>
  );
}