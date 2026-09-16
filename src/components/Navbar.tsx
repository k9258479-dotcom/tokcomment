import React from 'react';
import { TikTokLogoIcon } from './TikTokBadges';
import { Sparkles, Sun, Moon, Smartphone } from 'lucide-react';
import { ThemeMode } from '../types';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onApplyPromoPreset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onApplyPromoPreset,
}) => {
  return (
    <header className="w-full bg-neutral-950/90 border-b border-neutral-800/80 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neutral-900 to-neutral-800 border border-neutral-700/80 flex items-center justify-center relative group shadow-md shadow-black/40">
            {/* TokComment dual glow accent (TikTok Cyan and Magenta) */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#20D5EC] to-[#FE2C55] rounded-xl opacity-30 group-hover:opacity-60 blur-xs transition-opacity" />
            <div className="relative text-white flex items-center justify-center">
              <TikTokLogoIcon size={20} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center">
                <span className="text-white">Tok</span>
                <span className="text-[#FE2C55]">Comment</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-[#20D5EC]/15 text-[#20D5EC] rounded-full border border-[#20D5EC]/30">
                PRO STICKER GENERATOR
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium leading-none mt-0.5 hidden sm:block">
              Create realistic TikTok comment stickers & video mockups
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick preset for NMAX Winner / Promo Disclaimer */}
          <button
            type="button"
            onClick={onApplyPromoPreset}
            className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/70 flex items-center gap-1.5 transition-all shadow-sm"
            title="Load Giveaway Winner / Disclaimer Preset"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FE2C55]" />
            <span className="hidden md:inline">NMAX Winner Preset</span>
            <span className="md:hidden">Winner Preset</span>
          </button>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/60 flex items-center justify-center transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-200" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
