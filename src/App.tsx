import React, { useState } from 'react';
import { CommentState } from './types';
import { AVATAR_PRESETS, COMMENT_PRESETS } from './constants/presets';
import { Navbar } from './components/Navbar';
import { ControlsPanel } from './components/ControlsPanel';
import { PreviewStage } from './components/PreviewStage';
import { CheckCircle2, Video, Download, ShieldCheck, Zap } from 'lucide-react';

const INITIAL_STATE: CommentState = {
  mode: 'sticker',
  theme: 'light',
  platform: 'tiktok',

  // Author details
  avatar: AVATAR_PRESETS[0].url, // Suit professional matching screenshot
  name: 'username',
  username: 'username',
  isVerified: false,
  isCreator: false,
  pinned: false,

  // Comment content
  commentText: 'Write any comment and see what happens 😊',
  timestamp: '2h ago',
  likes: '14.2K',
  isLiked: false,

  // Creator like
  likedByCreator: false,
  creatorAvatar: AVATAR_PRESETS[1].url,
  creatorName: 'Creator Official',

  // Thread replies
  replies: [
    {
      id: 'reply-1',
      avatar: AVATAR_PRESETS[1].url,
      name: 'Creator Official',
      username: 'creator_official',
      text: 'Yes po! Verified and claimed at Muntinlupa showroom. Video proof posted! 🎉🛵',
      likes: '12.4K',
      isLiked: true,
      timestamp: '1h ago',
      isCreator: true,
      isVerified: true,
      isLikedByCreator: true,
    },
    {
      id: 'reply-2',
      avatar: AVATAR_PRESETS[3].url,
      name: 'Chloe Rider',
      username: 'chloe_rider',
      text: 'Congrats po sa nanalo! Sana all talaga 😭🛵',
      likes: '850',
      isLiked: false,
      timestamp: '45m ago',
      isCreator: false,
      isVerified: false,
    },
  ],
  showReplyCount: true,
  totalRepliesCount: '18',

  // Sticker specifics
  replyingToHandle: 'username',
  replyHeaderFormat: 'reply_to_user',
  showSpeechBubbleTail: true,
  showTikTokLogoOnSticker: false,
  stickerCardBg: 'auto',
  stickerHasShadow: true,
  stickerBorderRadius: 18,
  stickerFontSize: 21,
  transparentBackground: true,

  // Preview options
  previewScale: 1,
  previewBgType: 'tokcomment_dark',
  videoUrl: '/public/Nmax Winner Munti Disclaimer.mp4',
};

export default function App() {
  const [commentState, setCommentState] = useState<CommentState>(INITIAL_STATE);

  const handleUpdateState = (updates: Partial<CommentState>) => {
    setCommentState((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setCommentState(INITIAL_STATE);
  };

  const handleApplyPromoPreset = () => {
    // Specifically load the Nmax Winner / Munti Disclaimer preset
    handleUpdateState({
      name: 'Promo Coordinator',
      username: '@promoofficial_munti',
      commentText: 'DISCLAIMER: Congratulations to our official Muntinlupa NMAX 155 Winner! Unit successfully released. DTI Fair Trade Permit No. FTEB-19482. Ride safe! 🛵🎉',
      likes: '58.2K',
      timestamp: '1d ago',
      isVerified: true,
      isCreator: true,
      pinned: true,
      likedByCreator: true,
    });
  };

  const handleToggleTheme = () => {
    handleUpdateState({
      theme: commentState.theme === 'dark' ? 'light' : 'dark',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-[#FE2C55] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        theme={commentState.theme}
        onToggleTheme={handleToggleTheme}
        onApplyPromoPreset={handleApplyPromoPreset}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Workspace Grid */}
        <div className="flex flex-col lg:flex-row gap-6 items-start flex-1">
          {/* Left Column: Customization Controls Panel */}
          <ControlsPanel
            state={commentState}
            onUpdateState={handleUpdateState}
            onReset={handleReset}
          />

          {/* Right Column: Live Interactive Preview Canvas & Video Mockup */}
          <PreviewStage
            state={commentState}
            onUpdateState={handleUpdateState}
          />
        </div>

        {/* Feature Highlights / How to Use TokComment */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-800/80">
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-[#FE2C55] shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Transparent PNG
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                Export 3x ultra HD stickers without background ready for CapCut & Premiere.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#20D5EC]/10 text-[#20D5EC] shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Video Overlay Test
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                Drag and reposition comment stickers directly on realistic 9:16 TikTok videos.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Authentic TikTok UI
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                Exact fonts, blue verified badges, creator tags, and liked by creator hearts.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                100% Free & No Watermark
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                No sign up, no watermark, instant copy to clipboard or direct high-res download.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-800/80 py-4 px-6 text-center text-xs text-neutral-500">
        <p>
          TokComment &mdash; Free TikTok Comment Generator & Reply Sticker Creator. For creative mockups, UGC ads, and content production.
        </p>
      </footer>
    </div>
  );
}
