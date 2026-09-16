import React, { useState } from 'react';
import { CommentState, DisplayMode, ThemeMode } from '../types';
import { AVATAR_PRESETS, COMMENT_PRESETS, EMOJI_LIST } from '../constants/presets';
import {
  Upload,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Sliders,
  Smile,
  Heart,
  Pin,
  ShieldCheck,
  Moon,
  Sun,
  MessageSquare,
  FileText,
  RotateCcw,
  Camera,
  Link as LinkIcon,
} from 'lucide-react';

interface ControlsPanelProps {
  state: CommentState;
  onUpdateState: (updates: Partial<CommentState>) => void;
  onReset: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  state,
  onUpdateState,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'profile' | 'style' | 'replies'>('content');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarCategory, setAvatarCategory] = useState<'girls' | 'guys' | 'memes' | 'creators'>('creators');
  const [openReplyAvatarPickerId, setOpenReplyAvatarPickerId] = useState<string | null>(null);

  // Handle custom avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateState({ avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle reply avatar upload
  const handleReplyAvatarUpload = (
    replyId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const updated = state.replies.map((r) =>
            r.id === replyId ? { ...r, avatar: reader.result as string } : r
          );
          onUpdateState({ replies: updated });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle creator avatar upload
  const handleCreatorAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateState({ creatorAvatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Insert emoji into comment text
  const insertEmoji = (emoji: string) => {
    onUpdateState({ commentText: state.commentText + emoji });
  };

  // Apply comment preset
  const applyPreset = (idx: number) => {
    const preset = COMMENT_PRESETS[idx];
    if (preset) {
      onUpdateState({
        name: preset.name,
        username: preset.username,
        commentText: preset.commentText,
        likes: preset.likes,
        timestamp: preset.timestamp,
        isVerified: !!preset.isVerified,
        isCreator: !!preset.isCreator,
        likedByCreator: !!preset.likedByCreator,
        pinned: !!preset.pinned,
        ...(idx === 0
          ? {
              avatar: AVATAR_PRESETS[0].url,
              mode: 'sticker',
              theme: 'light',
              showSpeechBubbleTail: true,
              replyHeaderFormat: 'reply_to_user',
              stickerFontSize: 21,
              showTikTokLogoOnSticker: false,
            }
          : {}),
      });
    }
  };

  // Add new reply to thread
  const handleAddReply = () => {
    const newReply = {
      id: `reply-${Date.now()}`,
      avatar: AVATAR_PRESETS[1].url,
      name: 'User ' + Math.floor(100 + Math.random() * 900),
      username: 'user_' + Math.floor(1000 + Math.random() * 9000),
      text: 'Same here! Following for updates 🙏',
      likes: '1.2K',
      isLiked: false,
      timestamp: '1h ago',
      isCreator: false,
      isVerified: false,
    };
    onUpdateState({ replies: [...state.replies, newReply] });
  };

  // Remove reply
  const handleRemoveReply = (id: string) => {
    onUpdateState({ replies: state.replies.filter((r) => r.id !== id) });
  };

  return (
    <div className="w-full lg:w-[420px] shrink-0 bg-neutral-900/80 border border-neutral-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#20D5EC]" />
          <h2 className="text-sm font-bold text-white tracking-wide">
            Comment Customizer
          </h2>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-neutral-800"
          title="Reset to defaults"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Mode Selector */}
      <div className="p-4 border-b border-neutral-800/80 bg-neutral-950/40">
        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 block">
          Display Format
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => onUpdateState({ mode: 'sticker' })}
            className={`py-2 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
              state.mode === 'sticker'
                ? 'bg-gradient-to-r from-[#FE2C55] to-[#FF4F70] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <span>Reply Sticker</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateState({ mode: 'single' })}
            className={`py-2 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
              state.mode === 'single'
                ? 'bg-gradient-to-r from-[#FE2C55] to-[#FF4F70] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <span>Feed Comment</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateState({ mode: 'thread' })}
            className={`py-2 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
              state.mode === 'thread'
                ? 'bg-gradient-to-r from-[#FE2C55] to-[#FF4F70] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <span>Reply Thread</span>
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#20D5EC]" />
              Quick Templates
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {COMMENT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(idx)}
                className="shrink-0 text-[11px] px-2.5 py-1 bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg border border-neutral-700/60 whitespace-nowrap transition-colors"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-neutral-800 bg-neutral-900/50 px-3 pt-2 gap-2 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`pb-2 px-2 transition-colors relative ${
            activeTab === 'content'
              ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FE2C55]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Comment Text
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-2 px-2 transition-colors relative ${
            activeTab === 'profile'
              ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FE2C55]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Author Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`pb-2 px-2 transition-colors relative ${
            activeTab === 'style'
              ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FE2C55]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Appearance
        </button>
        {state.mode === 'thread' && (
          <button
            type="button"
            onClick={() => setActiveTab('replies')}
            className={`pb-2 px-2 transition-colors relative ${
              activeTab === 'replies'
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FE2C55]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Replies ({state.replies.length})
          </button>
        )}
      </div>

      {/* Tab Body */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[580px]">
        {/* TAB 1: CONTENT & ENGAGEMENT */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Comment text area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Comment Message
                </label>
                <span className="text-[10px] text-neutral-500">
                  {state.commentText.length} chars
                </span>
              </div>
              <textarea
                value={state.commentText}
                onChange={(e) => onUpdateState({ commentText: e.target.value })}
                rows={3}
                placeholder="Enter TikTok comment text..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FE2C55] transition-colors resize-none"
              />

              {/* Quick Emoji Bar */}
              <div className="mt-2 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                <Smile className="w-3.5 h-3.5 text-neutral-500 shrink-0 ml-0.5" />
                {EMOJI_LIST.map((em, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insertEmoji(em)}
                    className="p-1 hover:bg-neutral-800 rounded text-sm shrink-0 transition-transform active:scale-125"
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Engagement Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Likes Count */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Likes Count
                </label>
                <input
                  type="text"
                  value={state.likes}
                  onChange={(e) => onUpdateState({ likes: e.target.value })}
                  placeholder="e.g. 42.8K"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FE2C55]"
                />
              </div>

              {/* Timestamp */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Timestamp
                </label>
                <input
                  type="text"
                  value={state.timestamp}
                  onChange={(e) => onUpdateState({ timestamp: e.target.value })}
                  placeholder="e.g. 2h ago, 3-15"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FE2C55]"
                />
              </div>
            </div>

            {/* Engagement Toggles */}
            <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-800/80 space-y-3">
              {/* Liked state */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart
                    className={`w-4 h-4 ${
                      state.isLiked ? 'text-[#FE2C55] fill-[#FE2C55]' : 'text-neutral-400'
                    }`}
                  />
                  <span className="text-xs text-neutral-200">Red Heart Liked</span>
                </div>
                <input
                  type="checkbox"
                  checked={state.isLiked}
                  onChange={(e) => onUpdateState({ isLiked: e.target.checked })}
                  className="w-4 h-4 accent-[#FE2C55] rounded cursor-pointer"
                />
              </div>

              {/* Pinned by creator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pin className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs text-neutral-200">Pinned by Creator</span>
                </div>
                <input
                  type="checkbox"
                  checked={state.pinned}
                  onChange={(e) => onUpdateState({ pinned: e.target.checked })}
                  className="w-4 h-4 accent-[#FE2C55] rounded cursor-pointer"
                />
              </div>

              {/* Liked by creator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={state.creatorAvatar || state.avatar}
                      alt="Creator"
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="absolute -bottom-1 -right-1 text-[7px] text-[#FE2C55]">
                      ♥
                    </span>
                  </div>
                  <span className="text-xs text-neutral-200">Liked by Creator Pill</span>
                </div>
                <input
                  type="checkbox"
                  checked={state.likedByCreator}
                  onChange={(e) =>
                    onUpdateState({ likedByCreator: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#FE2C55] rounded cursor-pointer"
                />
              </div>
            </div>

            {/* If Liked By Creator is ON, option to customize Creator Avatar */}
            {state.likedByCreator && (
              <div className="p-3 bg-neutral-950/40 rounded-xl border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={state.creatorAvatar || state.avatar}
                    alt="Creator"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-700"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">Creator Avatar</p>
                    <p className="text-[10px] text-neutral-400">
                      Shows in "Liked by creator"
                    </p>
                  </div>
                </div>
                <label className="text-xs px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg cursor-pointer border border-neutral-700">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCreatorAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & BADGES */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Avatar Section */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Profile Avatar
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={state.avatar}
                  alt={state.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#FE2C55]/50 shadow-md"
                />

                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <label className="text-xs px-3 py-1.5 bg-[#FE2C55] hover:bg-[#ff1a47] text-white font-semibold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-sm transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-lg border border-neutral-700 transition-colors"
                    >
                      Presets
                    </button>
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    JPG, PNG, or GIF supported
                  </span>
                </div>
              </div>

              {/* Paste Direct Image URL */}
              <div className="mt-2.5 flex items-center gap-1.5 bg-neutral-950 px-2.5 py-1.5 rounded-lg border border-neutral-800">
                <LinkIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <input
                  type="url"
                  value={state.avatar.startsWith('data:') ? '' : state.avatar}
                  onChange={(e) => {
                    if (e.target.value.trim()) {
                      onUpdateState({ avatar: e.target.value.trim() });
                    }
                  }}
                  placeholder="Or paste direct image URL (https://...)"
                  className="w-full bg-transparent border-none text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              {/* Preset Avatars Drawer */}
              {showAvatarPicker && (
                <div className="mt-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-2 mb-2">
                    {(['creators', 'girls', 'guys', 'memes'] as const).map(
                      (cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setAvatarCategory(cat)}
                          className={`text-[11px] px-2 py-0.5 rounded capitalize ${
                            avatarCategory === cat
                              ? 'bg-neutral-700 text-white font-semibold'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATAR_PRESETS.filter(
                      (p) => p.category === avatarCategory
                    ).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          onUpdateState({ avatar: preset.url });
                          setShowAvatarPicker(false);
                        }}
                        className="relative group rounded-full overflow-hidden aspect-square ring-1 ring-neutral-700 hover:ring-[#FE2C55]"
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Display Name */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={state.name}
                onChange={(e) => onUpdateState({ name: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FE2C55]"
              />
            </div>

            {/* Username / Handle */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Username / Handle
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-neutral-500 font-mono">
                  @
                </span>
                <input
                  type="text"
                  value={state.username.replace(/^@/, '')}
                  onChange={(e) =>
                    onUpdateState({ username: `@${e.target.value.replace(/^@/, '')}` })
                  }
                  placeholder="username"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-7 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#FE2C55]"
                />
              </div>
            </div>

            {/* Verification & Creator Badges */}
            <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-800/80 space-y-3">
              {/* Verified Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#20D5EC]" />
                  <div>
                    <p className="text-xs text-neutral-200">Verified Blue Badge</p>
                    <p className="text-[10px] text-neutral-500">Official verified icon</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={state.isVerified}
                  onChange={(e) =>
                    onUpdateState({ isVerified: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#20D5EC] rounded cursor-pointer"
                />
              </div>

              {/* Creator Tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold text-[#FE2C55] bg-[#FE2C55]/10 rounded">
                    Creator
                  </span>
                  <div>
                    <p className="text-xs text-neutral-200">Creator Tag</p>
                    <p className="text-[10px] text-neutral-500">Author label tag</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={state.isCreator}
                  onChange={(e) =>
                    onUpdateState({ isCreator: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#FE2C55] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPEARANCE & STYLING */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            {/* Theme Mode */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Color Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateState({ theme: 'light' })}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    state.theme === 'light'
                      ? 'bg-white text-neutral-900 border-white shadow-lg'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateState({ theme: 'dark' })}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    state.theme === 'dark'
                      ? 'bg-neutral-800 text-white border-neutral-600 shadow-lg'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            {/* Sticker Background Fill */}
            {state.mode === 'sticker' && (
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2">
                  Sticker Card Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['auto', 'white', 'dark'] as const).map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => onUpdateState({ stickerCardBg: bg })}
                      className={`p-2 rounded-lg border text-xs capitalize font-medium ${
                        state.stickerCardBg === bg
                          ? 'border-[#FE2C55] text-white bg-neutral-800'
                          : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Speech Bubble Tail & Header Style */}
            {state.mode === 'sticker' && (
              <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-neutral-200 block">
                      Speech Bubble Pointer Tail
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Bottom-left triangular tail (TokComment / TikTok style)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={state.showSpeechBubbleTail}
                    onChange={(e) =>
                      onUpdateState({ showSpeechBubbleTail: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#FE2C55] rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Reply Header Format
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateState({ replyHeaderFormat: 'reply_to_user' })}
                      className={`p-2 rounded-lg border text-left text-[11px] leading-tight font-medium ${
                        state.replyHeaderFormat === 'reply_to_user'
                          ? 'border-[#FE2C55] bg-rose-500/10 text-rose-300'
                          : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900'
                      }`}
                    >
                      <span className="font-bold block text-white">Reply to user's</span>
                      <span>(Screenshot style)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateState({ replyHeaderFormat: 'replying_to_handle' })}
                      className={`p-2 rounded-lg border text-left text-[11px] leading-tight font-medium ${
                        state.replyHeaderFormat === 'replying_to_handle'
                          ? 'border-[#FE2C55] bg-rose-500/10 text-rose-300'
                          : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900'
                      }`}
                    >
                      <span className="font-bold block text-white">Replying to @user</span>
                      <span>(Feed style)</span>
                    </button>
                  </div>
                </div>

                {/* Font Size Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-300">
                      Comment Font Size
                    </label>
                    <span className="text-xs font-mono text-neutral-400">
                      {state.stickerFontSize || 21}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="28"
                    value={state.stickerFontSize || 21}
                    onChange={(e) =>
                      onUpdateState({ stickerFontSize: Number(e.target.value) })
                    }
                    className="w-full accent-[#FE2C55]"
                  />
                </div>
              </div>
            )}

            {/* Border Radius Slider */}
            {state.mode === 'sticker' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Corner Rounding
                  </label>
                  <span className="text-xs font-mono text-neutral-400">
                    {state.stickerBorderRadius}px
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="28"
                  value={state.stickerBorderRadius}
                  onChange={(e) =>
                    onUpdateState({ stickerBorderRadius: Number(e.target.value) })
                  }
                  className="w-full accent-[#FE2C55]"
                />
              </div>
            )}

            {/* Toggles */}
            <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-800/80 space-y-3">
              {state.mode === 'sticker' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-200">
                      Soft Drop Shadow
                    </span>
                    <input
                      type="checkbox"
                      checked={state.stickerHasShadow}
                      onChange={(e) =>
                        onUpdateState({ stickerHasShadow: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#FE2C55] rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-200">
                      TikTok Logo Badge (Top-Right)
                    </span>
                    <input
                      type="checkbox"
                      checked={state.showTikTokLogoOnSticker}
                      onChange={(e) =>
                        onUpdateState({
                          showTikTokLogoOnSticker: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#FE2C55] rounded cursor-pointer"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-200">
                    Transparent Background for Export
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    Removes container background for PNG
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={state.transparentBackground}
                  onChange={(e) =>
                    onUpdateState({ transparentBackground: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#FE2C55] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REPLIES (Thread Mode) */}
        {activeTab === 'replies' && state.mode === 'thread' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300">
                Nested Replies List
              </span>
              <button
                type="button"
                onClick={handleAddReply}
                className="text-xs px-2.5 py-1 bg-[#FE2C55] hover:bg-[#ff1a47] text-white font-medium rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Reply</span>
              </button>
            </div>

            {state.replies.map((reply, index) => (
              <div
                key={reply.id}
                className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-400">
                    Reply #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveReply(reply.id)}
                    className="text-neutral-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reply Profile Avatar Row */}
                <div className="flex items-center gap-2.5 p-2 bg-neutral-900/90 rounded-lg border border-neutral-800">
                  <div className="relative group shrink-0">
                    <img
                      src={reply.avatar}
                      alt={reply.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-700 shadow-sm"
                    />
                    <label
                      title="Upload photo"
                      className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-[10px]"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleReplyAvatarUpload(reply.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-neutral-300 block">
                      Profile Picture
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <label className="text-[10px] px-2 py-0.5 bg-[#FE2C55] hover:bg-[#ff1a47] text-white font-semibold rounded cursor-pointer flex items-center gap-1 transition-colors">
                        <Upload className="w-2.5 h-2.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReplyAvatarUpload(reply.id, e)}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenReplyAvatarPickerId(
                            openReplyAvatarPickerId === reply.id ? null : reply.id
                          )
                        }
                        className="text-[10px] px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700"
                      >
                        Presets
                      </button>
                    </div>
                  </div>
                </div>

                {/* Drawer for Reply Avatar Presets */}
                {openReplyAvatarPickerId === reply.id && (
                  <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-700/60">
                    <p className="text-[10px] text-neutral-400 font-semibold mb-1.5 uppercase">
                      Select Preset Profile:
                    </p>
                    <div className="grid grid-cols-6 gap-1.5 max-h-28 overflow-y-auto pr-1">
                      {AVATAR_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            const updated = state.replies.map((r) =>
                              r.id === reply.id ? { ...r, avatar: p.url } : r
                            );
                            onUpdateState({ replies: updated });
                            setOpenReplyAvatarPickerId(null);
                          }}
                          className="rounded-full overflow-hidden aspect-square ring-1 ring-neutral-700 hover:ring-[#FE2C55] transition-all"
                          title={p.name}
                        >
                          <img
                            src={p.url}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={reply.name}
                    onChange={(e) => {
                      const updated = state.replies.map((r) =>
                        r.id === reply.id ? { ...r, name: e.target.value } : r
                      );
                      onUpdateState({ replies: updated });
                    }}
                    placeholder="Name"
                    className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={reply.likes}
                    onChange={(e) => {
                      const updated = state.replies.map((r) =>
                        r.id === reply.id ? { ...r, likes: e.target.value } : r
                      );
                      onUpdateState({ replies: updated });
                    }}
                    placeholder="Likes (e.g. 520)"
                    className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-white"
                  />
                </div>

                <textarea
                  value={reply.text}
                  onChange={(e) => {
                    const updated = state.replies.map((r) =>
                      r.id === reply.id ? { ...r, text: e.target.value } : r
                    );
                    onUpdateState({ replies: updated });
                  }}
                  rows={2}
                  placeholder="Reply text..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white resize-none"
                />

                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reply.isCreator}
                      onChange={(e) => {
                        const updated = state.replies.map((r) =>
                          r.id === reply.id
                            ? { ...r, isCreator: e.target.checked }
                            : r
                        );
                        onUpdateState({ replies: updated });
                      }}
                      className="accent-[#FE2C55]"
                    />
                    <span>Creator Tag</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reply.isLikedByCreator}
                      onChange={(e) => {
                        const updated = state.replies.map((r) =>
                          r.id === reply.id
                            ? { ...r, isLikedByCreator: e.target.checked }
                            : r
                        );
                        onUpdateState({ replies: updated });
                      }}
                      className="accent-[#FE2C55]"
                    />
                    <span>Liked by Creator</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
