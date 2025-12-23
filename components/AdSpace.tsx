import React, { useEffect, useRef } from 'react';

interface AdSpaceProps {
  position: 'sidebar' | 'bottom';
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdSpace: React.FC<AdSpaceProps> = ({ position }) => {
  const isSidebar = position === 'sidebar';
  const adRef = useRef<HTMLDivElement>(null);

  // ===========================================================================
  // STEP 2: CONFIGURE YOUR ADS HERE
  // ===========================================================================
  
  // TODO: 1. Paste your "Publisher ID" inside the quotes below
  const AD_CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXXX"; 
  
  // TODO: 2. Paste your "Ad Slot IDs" inside the quotes below
  const AD_SLOT_ID = isSidebar 
    ? "1234567890"  // <-- PASTE SIDEBAR ID HERE
    : "0987654321"; // <-- PASTE BOTTOM ID HERE

  const AD_FORMAT = "auto";
  
  // TODO: 3. Change this to 'false' to enable Real Ads
  const IS_TEST_MODE = true; 

  // ===========================================================================

  useEffect(() => {
    if (!IS_TEST_MODE && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [position]);

  // If in Test Mode, show the placeholder box
  if (IS_TEST_MODE) {
    return (
      <div 
        className={`
          bg-vite-light border border-white/5 flex items-center justify-center 
          text-white/20 text-sm font-mono tracking-widest uppercase select-none
          overflow-hidden relative group
          ${isSidebar ? 'h-full w-full min-h-[300px] flex-col' : 'h-full w-full flex-row'}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-vite-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <span className={isSidebar ? 'rotate-90 md:rotate-0' : ''}>
          Ad Space ({position})
        </span>
        <div className="text-[9px] absolute bottom-2 text-white/10 text-center px-4">
          Look for TODO comments in components/AdSpace.tsx
        </div>
        {/* Decorative lines */}
        <div className={`absolute bg-white/5 ${isSidebar ? 'w-full h-px top-10' : 'h-full w-px left-10'}`}></div>
        <div className={`absolute bg-white/5 ${isSidebar ? 'w-full h-px bottom-10' : 'h-full w-px right-10'}`}></div>
      </div>
    );
  }

  // Real Ad Code
  return (
    <div className={`w-full h-full bg-[#050507] flex items-center justify-center overflow-hidden ${isSidebar ? 'min-h-[600px]' : 'min-h-[100px]'}`}>
      <div ref={adRef} className="w-full h-full">
         <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: '100%' }}
             data-ad-client={AD_CLIENT_ID}
             data-ad-slot={AD_SLOT_ID}
             data-ad-format={AD_FORMAT}
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
};