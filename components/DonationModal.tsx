import React, { useState } from 'react';
import { CoffeeIcon, HeartIcon, WalletIcon, CopyIcon, CheckIcon, XIcon, PayPalIcon } from './Icons';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  // REPLACE WITH YOUR ACTUAL WALLET ADDRESS
  const cryptoAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(cryptoAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#161618] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-float">
        {/* Decorative Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vite-cyan via-vite-purple to-vite-pink"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vite-pink/20 to-vite-purple/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            <HeartIcon className="w-8 h-8 text-vite-pink" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Fuel the Aether</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            AetherLoad is free, ad-free, and open for everyone. Your support helps cover server costs and keeps the engine running smoothly.
          </p>

          <div className="w-full space-y-3">
            {/* PayPal Button */}
            <a 
              href="https://paypal.me/YOUR_PAYPAL_ME" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-[#0070BA] text-white font-bold hover:bg-[#005ea6] transition-transform active:scale-95 group shadow-lg shadow-blue-900/20"
            >
              <PayPalIcon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              Donate via PayPal
            </a>

            {/* Buy Me A Coffee Button */}
            <a 
              href="https://buymeacoffee.com/YOUR_USERNAME" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-[#FFDD00] text-black font-bold hover:bg-[#ffea5c] transition-transform active:scale-95 group"
            >
              <CoffeeIcon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              Buy me a Coffee
            </a>

            {/* Crypto Section */}
            <div className="relative w-full p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-vite-cyan/30 transition-colors mt-2">
              <div className="flex items-center gap-3 mb-3 text-gray-300 font-semibold text-sm">
                 <WalletIcon className="w-4 h-4 text-vite-cyan" />
                 <span>Crypto Support (ETH/ERC20)</span>
              </div>
              <div 
                onClick={handleCopy}
                className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5 cursor-pointer hover:bg-black/60 transition-colors"
              >
                <code className="text-xs text-gray-500 font-mono truncate mr-2">
                  {cryptoAddress}
                </code>
                <div className={`p-1.5 rounded-md transition-colors ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                  {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">
             Thank you for being part of the journey
          </p>
        </div>
      </div>
    </div>
  );
};