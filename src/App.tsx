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
      id: 'rep-bday-1',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      name: 'User Not Found',
      username: 'User Not Found',
      text: 'happy birthday bro😚',
      likes: '1',
      isLiked: false,
      timestamp: '4d ago',
      isCreator: false,
      isVerified: false,
    },
    {
      id: 'rep-bday-2',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      name: 'mallboroo.69',
      username: 'mallboroo.69',
      text: 'Mayy Broo,,🫂💋',
      likes: '2',
      isLiked: false,
      timestamp: '4d ago',
      isCreator: false,
      isVerified: false,
    },
    {
      id: 'rep-bday-3',
      avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
      name: '🪶 Unloved Soul 🪶',
      username: 'unloved_soul',
      text: 'happy birthday to you',
      likes: '2',
      isLiked: false,
      timestamp: '5d ago',
      isCreator: false,
      isVerified: false,
    },
    {
      id: 'rep-bday-4',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      name: '🪶 Unloved Soul 🪶',
      username: 'unloved_soul',
      text: '',
      likes: '2',
      isLiked: false,
      timestamp: '6d ago',
      isCreator: false,
      isVerified: false,
      imageAttachment: '/assets/crying_doodle.svg',
      imageAttachmentType: 'sticker',
    },
    {
      id: 'rep-bday-5',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      name: 'mallboroo.69',
      username: 'mallboroo.69',
      text: '',
      likes: '2',
      isLiked: false,
      timestamp: '5d ago',
      isCreator: false,
      isVerified: false,
      imageAttachment: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80',
      imageAttachmentType: 'image',
    },
  ],
  showReplyCount: true,
  totalRepliesCount: '22',
  commentsCountTitle: 'Comments',
  totalCommentsCount: '700',
  moreRepliesText: 'View 22 more',
  showCloseButton: true,
  showBottomExpanders: true,

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
