import React, { useRef, useState } from 'react';
import { CommentState } from '../types';
import { CommentSticker } from './CommentSticker';
import { CommentFeedItem } from './CommentFeedItem';
import { CommentThread } from './CommentThread';
import {
  Download,
  Copy,
  Check,
  Video,
  Layers,
  Sparkles,
  Play,
  Pause,
  Upload,
  Volume2,
  VolumeX,
  RotateCcw,
  Move,
  ZoomIn,
  ZoomOut,
  Smartphone,
  Eye,
  Moon,
  Sun,
  Palette,
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import confetti from 'canvas-confetti';

interface PreviewStageProps {
  state: CommentState;
  onUpdateState: (updates: Partial<CommentState>) => void;
}

export const PreviewStage: React.FC<PreviewStageProps> = ({ state, onUpdateState }) => {
  const exportTargetRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [phoneViewActive, setPhoneViewActive] = useState(false);

  // Drag position for sticker over video
  const [stickerPos, setStickerPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialPosX: 0, initialPosY: 0 });

  // Handle Download PNG
  const handleDownload = async (transparent: boolean = true) => {
    if (!exportTargetRef.current) return;
    setIsExporting(true);

    try {
      // Small pause for state render
      await new Promise((r) => setTimeout(r, 100));

      const dataUrl = await toPng(exportTargetRef.current, {
        pixelRatio: 3, // Ultra crisp 3x resolution for video editors
        skipFonts: true, // Prevents "Failed to read cssRules from CSSStyleSheet" cross-origin error
        cacheBust: true,
        backgroundColor: transparent ? undefined : state.theme === 'dark' ? '#121212' : '#ffffff',
        filter: (node) => {
          // exclude controls or non-exportable overlays
          if (node instanceof HTMLElement && node.classList.contains('no-export')) {
            return false;
          }
          return true;
        },
      });

      const link = document.createElement('a');
      const filename = `tiktok-comment-${state.mode}-${Date.now()}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Failed to export image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Copy to Clipboard
  const handleCopyClipboard = async () => {
    if (!exportTargetRef.current) return;
    setIsExporting(true);

    try {
      const blob = await toBlob(exportTargetRef.current, {
        pixelRatio: 2,
        skipFonts: true,
        cacheBust: true,
        backgroundColor: state.transparentBackground ? undefined : state.theme === 'dark' ? '#121212' : '#ffffff',
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Drag handlers for sticker
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!phoneViewActive) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: stickerPos.x,
      initialPosY: stickerPos.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;
    setStickerPos({
      x: dragStartRef.current.initialPosX + deltaX,
      y: dragStartRef.current.initialPosY + deltaY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateState({ videoUrl: url });
      setPhoneViewActive(true);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const resetPosition = () => {
    setStickerPos({ x: 0, y: 0 });
  };

  return (
    <div
      className="flex-1 flex flex-col bg-neutral-900/60 border border-neutral-800/80 rounded-2xl overflow-hidden shadow-2xl relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Toolbar */}
      <div className="px-5 py-3.5 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center justify-between flex-wrap gap-3 z-10 backdrop-blur-md">
        {/* Left View Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Canvas Background Presets */}
          <div className="flex items-center bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
            <button
              type="button"
              id="btn-bg-tokcomment"
              onClick={() => onUpdateState({ previewBgType: 'tokcomment_dark' })}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                state.previewBgType === 'tokcomment_dark'
                  ? 'bg-[#8A2BE2]/30 text-purple-300 font-semibold border border-purple-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Screenshot Dark Studio Glow"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Studio Glow</span>
            </button>

            <button
              type="button"
              id="btn-bg-checkerboard"
              onClick={() => onUpdateState({ previewBgType: 'checkerboard' })}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                state.previewBgType === 'checkerboard'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Checkerboard Grid"
            >
              <Layers className="w-3 h-3" />
              <span>Grid</span>
            </button>
          </div>

          <button
            type="button"
            id="btn-toggle-transparent"
            onClick={() =>
              onUpdateState({
                transparentBackground: !state.transparentBackground,
              })
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              state.transparentBackground
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
            title="Toggle Transparent Background"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{state.transparentBackground ? 'Transparent PNG' : 'Solid PNG'}</span>
          </button>

          <button
            type="button"
            id="btn-toggle-phone-mockup"
            onClick={() => setPhoneViewActive(!phoneViewActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              phoneViewActive
                ? 'bg-[#20D5EC]/20 text-[#20D5EC] border border-[#20D5EC]/40'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
            title="Test over TikTok Video Mockup"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>TikTok Video Mockup</span>
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-neutral-800/80 rounded-lg p-0.5 border border-neutral-700/50">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
              className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-neutral-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.1))}
              className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-copy-clipboard"
            onClick={handleCopyClipboard}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="btn-download-png"
            onClick={() => handleDownload(state.transparentBackground)}
            disabled={isExporting}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#FE2C55] to-[#FF4F70] hover:from-[#ff1a47] hover:to-[#ff3a60] text-white shadow-lg shadow-rose-500/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Download PNG'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        className={`flex-1 overflow-auto p-6 md:p-12 flex items-center justify-center relative min-h-[500px] transition-colors ${
          state.previewBgType === 'tokcomment_dark'
            ? 'bg-[#05040a]'
            : state.previewBgType === 'checkerboard'
            ? 'bg-[#0d0e12]'
            : state.theme === 'dark'
            ? 'bg-[#121216]'
            : 'bg-neutral-200'
        }`}
      >
        {/* TokComment Studio Glow Vignette (Exact match to screenshot) */}
        {state.previewBgType === 'tokcomment_dark' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, #160a2c 0%, #090614 60%, #030206 100%)',
            }}
          />
        )}

        {/* Transparent Checkerboard Pattern CSS background */}
        {state.previewBgType === 'checkerboard' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
        )}

        {/* VIEW 1: Full TikTok Smartphone Simulator with Video Mockup */}
        {phoneViewActive ? (
          <div className="relative flex flex-col items-center">
            {/* Controls banner above phone */}
            <div className="mb-3 px-3 py-1.5 bg-neutral-800/90 rounded-full border border-neutral-700/60 flex items-center gap-3 text-xs text-neutral-300">
              <span className="flex items-center gap-1 text-[#20D5EC]">
                <Move className="w-3.5 h-3.5 animate-pulse" />
                Drag sticker anywhere on screen
              </span>
              <span className="text-neutral-500">|</span>
              <button
                type="button"
                onClick={resetPosition}
                className="hover:text-white flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Pos
              </button>
              <label className="cursor-pointer hover:text-white flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                <Upload className="w-3 h-3" />
                Change Video
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Smartphone frame */}
            <div
              className="relative w-[340px] h-[680px] sm:w-[360px] sm:h-[720px] rounded-[48px] p-3.5 bg-neutral-900 ring-1 ring-neutral-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col justify-between overflow-hidden"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
              }}
            >
              {/* Inner Screen */}
              <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-black flex flex-col justify-between select-none">
                {/* Background Video Player */}
                <div className="absolute inset-0 w-full h-full">
                  <video
                    ref={videoRef}
                    src={
                      state.videoUrl ||
                      '/public/Nmax Winner Munti Disclaimer.mp4'
                    }
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback: If custom video file is not found, fallback to animated high-energy backdrop or placeholder
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                  {/* Fallback visual gradient canvas if video isn't present or loading */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-900 via-neutral-800 to-black flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                      <Video className="w-8 h-8" />
                    </div>
                    <p className="text-white font-semibold text-sm">
                      TikTok Video Background
                    </p>
                    <p className="text-neutral-400 text-xs mt-1">
                      Upload your video or preview comment sticker in place
                    </p>
                    <label className="mt-3 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-xs text-white font-medium cursor-pointer">
                      Upload MP4 Video
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Subtle vignette for contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                {/* TikTok Top Bar */}
                <div className="relative z-10 pt-4 px-4 flex items-center justify-between text-white/90 text-sm font-semibold tracking-wide">
                  <span className="text-xs opacity-70">LIVE</span>
                  <div className="flex items-center gap-3 text-[14px]">
                    <span className="opacity-60 font-medium">Following</span>
                    <span className="font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-white">
                      For You
                    </span>
                  </div>
                  <span className="text-xs font-normal opacity-90">🔍</span>
                </div>

                {/* Draggable Comment Sticker on Screen */}
                <div
                  className="absolute z-20 cursor-grab active:cursor-grabbing select-none"
                  style={{
                    transform: `translate(calc(-50% + ${stickerPos.x}px), calc(-50% + ${stickerPos.y}px))`,
                    left: '50%',
                    top: '40%',
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <div className="pointer-events-auto filter drop-shadow-xl">
                    <div ref={exportTargetRef}>
                      {state.mode === 'sticker' ? (
                        <CommentSticker state={state} />
                      ) : state.mode === 'single' ? (
                        <CommentFeedItem
                          state={state}
                          onToggleLike={() =>
                            onUpdateState({ isLiked: !state.isLiked })
                          }
                        />
                      ) : (
                        <CommentThread
                          state={state}
                          onToggleMainLike={() =>
                            onUpdateState({ isLiked: !state.isLiked })
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* TikTok Right Action Column */}
                <div className="absolute right-2.5 bottom-20 z-10 flex flex-col items-center gap-4 text-white">
                  {/* Creator avatar with plus */}
                  <div className="relative mb-2">
                    <img
                      src={state.avatar}
                      alt="Creator"
                      className="w-10 h-10 rounded-full border border-white object-cover"
                    />
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FE2C55] text-white flex items-center justify-center text-[10px] font-bold">
                      +
                    </div>
                  </div>

                  {/* Likes */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-xl">❤️</span>
                    </div>
                    <span className="text-[11px] font-semibold mt-0.5">582.4K</span>
                  </div>

                  {/* Comments */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-lg">💬</span>
                    </div>
                    <span className="text-[11px] font-semibold mt-0.5">4,912</span>
                  </div>

                  {/* Bookmark */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-lg">🔖</span>
                    </div>
                    <span className="text-[11px] font-semibold mt-0.5">82.1K</span>
                  </div>

                  {/* Share */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-lg">↗️</span>
                    </div>
                    <span className="text-[11px] font-semibold mt-0.5">14.8K</span>
                  </div>

                  {/* Spinning Audio Record */}
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center animate-spin text-[10px] [animation-duration:4s]">
                    🎵
                  </div>
                </div>

                {/* TikTok Bottom Info */}
                <div className="relative z-10 px-4 pb-4 text-white max-w-[75%]">
                  <p className="font-bold text-sm">@{state.username.replace(/^@/, '')}</p>
                  <p className="text-xs text-white/90 mt-1 line-clamp-2">
                    Replying to your comments! Giveaway disclaimer & details below 👇 #winner #nmax #promo #legit
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-white/80 mt-2">
                    <span>♫ original sound - Official Creator</span>
                  </div>
                </div>

                {/* Floating Video Controls in preview */}
                <div className="absolute top-12 right-4 z-20 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center text-xs hover:bg-black/70"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center text-xs hover:bg-black/70"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: Clean Export Stage (Isolated Card matching screenshot) */
          <div
            className="flex flex-col items-center justify-center transition-transform py-6"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
            }}
          >
            {/* The Sticker Card with Floating Moon Button (Matching Screenshot) */}
            <div className="relative inline-block filter drop-shadow-2xl">
              {/* Floating Moon / Sun Mode Toggle (Exact placement from user screenshot) */}
              <button
                type="button"
                id="btn-sticker-floating-theme"
                onClick={() =>
                  onUpdateState({
                    theme: state.theme === 'dark' ? 'light' : 'dark',
                  })
                }
                className="no-export absolute -top-5 -right-3 sm:-top-6 sm:-right-4 w-10 h-10 rounded-full bg-[#1b1929]/95 hover:bg-[#28253d] border border-white/20 text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer group"
                title={
                  state.theme === 'dark'
                    ? 'Switch Sticker to Light Mode'
                    : 'Switch Sticker to Dark Mode'
                }
              >
                {state.theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-300 transition-transform group-hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-neutral-200 transition-transform group-hover:-rotate-12" />
                )}
              </button>

              {/* Export Target Element */}
              <div ref={exportTargetRef} className="inline-block">
                {state.mode === 'sticker' ? (
                  <CommentSticker
                    state={state}
                    onUpdateState={onUpdateState}
                    isEditable={true}
                  />
                ) : state.mode === 'single' ? (
                  <CommentFeedItem
                    state={state}
                    onToggleLike={() =>
                      onUpdateState({ isLiked: !state.isLiked })
                    }
                  />
                ) : (
                  <CommentThread
                    state={state}
                    onToggleMainLike={() =>
                      onUpdateState({ isLiked: !state.isLiked })
                    }
                    onToggleReplyLike={(replyId) => {
                      const updated = state.replies.map((r) =>
                        r.id === replyId ? { ...r, isLiked: !r.isLiked } : r
                      );
                      onUpdateState({ replies: updated });
                    }}
                  />
                )}
              </div>
            </div>

            {/* Quick Helper Badge */}
            <div className="mt-8 flex items-center gap-2 text-xs text-neutral-400 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Transparent PNG Ready with Speech Bubble Pointer</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
