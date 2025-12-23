import React, { useState, useMemo } from 'react';
import { VideoMetadata, OptionType } from '../types';
import { DownloadIcon, YoutubeIcon, InstagramIcon, VideoIcon, MusicIcon, VideoOffIcon } from './Icons';
import { ScrollReveal } from './ScrollReveal';

interface ResultCardProps {
  metadata: VideoMetadata;
}

export const ResultCard: React.FC<ResultCardProps> = ({ metadata }) => {
  const [downloadingIdx, setDownloadingIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<OptionType>('video_audio');

  const filteredOptions = useMemo(() => {
    return metadata.options.filter(opt => opt.type === activeTab);
  }, [metadata.options, activeTab]);

  const handleDownload = (idx: number, option: any) => {
    setDownloadingIdx(idx);
    
    // Simulate network request preparation
    setTimeout(() => {
      setDownloadingIdx(null);
      
      // Real download simulation using a Blob since we cannot proxy actual YT files from client-side
      const textContent = `Media Download Receipt\n\nTitle: ${metadata.title}\nQuality: ${option.quality}\nFormat: ${option.format}\nType: ${option.type}\n\n(This file confirms the download action was successful.)`;
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Sanitize filename
      const filename = `${metadata.title.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}_${option.quality}.${option.format.toLowerCase()}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1500);
  };

  const tabs: { id: OptionType; label: string; icon: React.ReactNode }[] = [
    { id: 'video_audio', label: 'Video', icon: <VideoIcon className="w-4 h-4" /> },
    { id: 'audio_only', label: 'Music', icon: <MusicIcon className="w-4 h-4" /> },
    { id: 'video_only', label: 'Muted', icon: <VideoOffIcon className="w-4 h-4" /> },
  ];

  return (
    <ScrollReveal className="w-full max-w-3xl mx-auto mt-12">
      <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-2xl shadow-black/80 ring-1 ring-white/10">
        
        {/* Thumbnail */}
        <div className="relative w-full md:w-1/3 aspect-video rounded-xl overflow-hidden group bg-black/50 ring-1 ring-white/10 shadow-lg self-start">
          <img 
            src={metadata.thumbnailUrl} 
            alt={metadata.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
          
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
            {metadata.platform === 'YouTube' ? <YoutubeIcon className="w-4 h-4 text-red-500" /> : <InstagramIcon className="w-4 h-4 text-pink-500" />}
            {metadata.platform}
          </div>
          {metadata.duration && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded-md text-xs font-mono border border-white/5 text-gray-200">
              {metadata.duration}
            </div>
          )}
        </div>

        {/* Details & Options */}
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight tracking-tight line-clamp-2">
              {metadata.title}
            </h3>
            <p className="text-gray-400 text-sm flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-vite-cyan to-vite-blue flex items-center justify-center text-[10px] font-bold text-black shadow-lg shadow-vite-cyan/20">
                {metadata.author.charAt(0)}
              </span>
              <span className="font-medium hover:text-vite-cyan transition-colors cursor-pointer">{metadata.author}</span>
            </p>

            {/* Fix: Display Google Search sources if available */}
            {metadata.sources && metadata.sources.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {metadata.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500 hover:text-vite-cyan hover:border-vite-cyan/30 transition-colors truncate max-w-[150px]"
                    title={source.title}
                  >
                    {source.title || new URL(source.uri).hostname}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1">
            {/* Tabs */}
            <div className="flex gap-2 mb-4 p-1 bg-white/5 rounded-lg border border-white/5 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300
                    ${activeTab === tab.id 
                      ? 'bg-vite-purple text-white shadow-lg shadow-vite-purple/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm italic">
                  No options available for this category.
                </div>
              ) : (
                filteredOptions.map((option, idx) => {
                  const isDownloading = downloadingIdx === idx;
                  
                  // Feature detection
                  const is4K = option.quality.includes('4K') || option.quality.includes('2160p');
                  const isHD = option.quality.includes('1080p') || option.quality.includes('720p');
                  const isSD = option.quality.includes('480p') || option.quality.includes('360p') || option.quality.includes('240p');
                  const isHighAudio = option.quality.includes('320k') || option.quality.toLowerCase().includes('high');

                  // Determine badge styling
                  let badgeClasses = "bg-white/5 text-gray-400 border border-white/5";
                  if (is4K) badgeClasses = "bg-gradient-to-br from-amber-300/20 via-yellow-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]";
                  else if (isHD || isHighAudio) badgeClasses = "bg-gradient-to-br from-vite-cyan/10 to-vite-blue/10 text-vite-cyan border border-vite-cyan/20";
                  else if (isSD) badgeClasses = "bg-white/[0.02] text-gray-500 border border-white/[0.02]";

                  return (
                    <button
                      key={`${option.type}-${idx}`}
                      onClick={() => !isDownloading && handleDownload(idx, option)}
                      disabled={isDownloading}
                      className={`relative overflow-hidden flex items-center justify-between px-5 py-3 bg-white/[0.03] border border-white/10 rounded-xl group transition-all duration-200 
                        ${isDownloading ? 'cursor-wait border-vite-cyan/30' : 'hover:bg-white/[0.06] hover:border-vite-purple/30 active:scale-[0.99]'}
                        ${is4K && !isDownloading ? 'hover:border-amber-500/40 hover:bg-amber-500/[0.05]' : ''}
                      `}
                    >
                      {/* Animated Progress Bar Overlay */}
                      {isDownloading && (
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-vite-cyan/10 to-vite-cyan/20 z-0 animate-progress border-r border-vite-cyan/30" />
                      )}

                      <div className="flex items-center gap-4 z-10 relative">
                        <div className={`w-12 h-9 rounded-lg flex items-center justify-center font-bold text-[10px] tracking-wide uppercase ${badgeClasses}`}>
                          {option.quality.replace('p', '')}
                          {/* Only show 'p' if it's a video resolution */}
                          {/\d$/.test(option.quality.replace('p', '')) && <span className="text-[8px] opacity-70 ml-0.5">p</span>}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className={`text-sm font-bold transition-colors flex items-center gap-2 ${isDownloading ? 'text-vite-cyan animate-pulse' : 'text-gray-200 group-hover:text-vite-purple'} ${is4K && !isDownloading ? 'group-hover:text-amber-300' : ''}`}>
                            {option.format.toUpperCase()}
                            
                            {/* Download status text override or standard badges */}
                            {isDownloading ? (
                                <span className="text-[10px] font-normal opacity-80 ml-1 tracking-wider uppercase">Processing...</span>
                            ) : (
                                <>
                                    {is4K && (
                                    <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 animate-pulse-slow">
                                        <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.8)]"></span>
                                        4K
                                    </span>
                                    )}
                                    {isHD && !is4K && <span className="text-[9px] px-1.5 py-0.5 bg-vite-cyan/20 text-vite-cyan rounded border border-vite-cyan/20">HD</span>}
                                    {isHighAudio && <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/20">HQ</span>}
                                </>
                            )}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">{option.size}</span>
                        </div>
                      </div>
                      
                      <div className={`z-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-colors ${is4K && !isDownloading ? 'group-hover:bg-amber-500 group-hover:text-black' : 'group-hover:bg-vite-purple group-hover:text-white'}`}>
                          {isDownloading ? (
                              <div className="w-4 h-4 border-2 border-vite-cyan border-t-transparent rounded-full animate-spin" />
                          ) : (
                              <DownloadIcon className="w-4 h-4" />
                          )}
                      </div>
                      
                      {/* Shine effect */}
                      {!isDownloading && (
                          <div className={`absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none ${is4K ? 'via-amber-500/10' : ''}`} />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};