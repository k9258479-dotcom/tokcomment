import React from 'react';
import { CommentState } from '../types';
import { TikTokVerifiedBadge, TikTokPinIcon, TikTokHeartIcon } from './TikTokBadges';
import { Camera } from 'lucide-react';

interface CommentFeedItemProps {
  state: CommentState;
  id?: string;
  onToggleLike?: () => void;
  onUpdateState?: (updates: Partial<CommentState>) => void;
}

export const CommentFeedItem: React.FC<CommentFeedItemProps> = ({
  state,
  id = 'tiktok-comment-feed-item',
  onToggleLike,
  onUpdateState,
}) => {
  const isDark = state.theme === 'dark';

  const containerBg = state.transparentBackground
    ? 'bg-transparent'
    : isDark
    ? 'bg-[#121212]'
    : 'bg-white';

  const textColor = isDark ? 'text-white' : 'text-[#161823]';
  const subtextColor = isDark ? 'text-[#8a8b91]' : 'text-[#8a8b91]';
  const nameColor = isDark ? 'text-[#e1e2e4]' : 'text-[#161823]';

  return (
    <div
      id={id}
      className={`w-full max-w-[480px] p-4 transition-colors select-none ${containerBg}`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "TikTok Sans", sans-serif',
      }}
    >
      {/* Pinned by creator badge */}
      {state.pinned && (
        <div className="flex items-center gap-1.5 mb-2 ml-12 text-[#8a8b91] text-[12px] font-medium">
          <TikTokPinIcon className="text-[#8a8b91]" />
          <span>Pinned by creator</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Author Avatar */}
        <div className="relative shrink-0 group">
          <img
            src={state.avatar}
            alt={state.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/5"
          />
          {onUpdateState && (
            <label
              title="Click to change profile picture"
              className="no-export absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[8px] font-semibold"
            >
              <Camera className="w-3.5 h-3.5 text-white mb-0.5" />
              <span>Change</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
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
                }}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Author Name, Verified, Creator Tag */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[13px] font-bold tracking-tight ${nameColor}`}>
              {state.name || state.username}
            </span>
            {state.isVerified && <TikTokVerifiedBadge size={14} />}
            {state.isCreator && (
              <span className="px-1.5 py-0.2 text-[10px] font-semibold text-[#FE2C55] bg-[#FE2C55]/10 rounded tracking-tight">
                Creator
              </span>
            )}
          </div>

          {/* Comment text */}
          <p
            className={`mt-1 text-[14.5px] leading-[1.4] break-words whitespace-pre-wrap ${textColor}`}
          >
            {state.commentText}
          </p>

          {/* Meta footer */}
          <div className="mt-2 flex items-center gap-4 text-[12px] font-normal flex-wrap">
            <span className={subtextColor}>{state.timestamp}</span>

            <button
              type="button"
              className={`font-semibold transition-colors hover:underline ${subtextColor}`}
            >
              Reply
            </button>

            {/* Liked by creator pill */}
            {state.likedByCreator && (
              <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full">
                <div className="relative shrink-0">
                  <img
                    src={state.creatorAvatar || state.avatar}
                    alt="Creator"
                    referrerPolicy="no-referrer"
                    className="w-3.5 h-3.5 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#FE2C55] rounded-full flex items-center justify-center text-[5px] text-white">
                    ♥
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#FE2C55]">
                  Liked by creator
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Likes column */}
        <div
          onClick={onToggleLike}
          className="flex flex-col items-center justify-center pl-1 cursor-pointer select-none group"
          title="Toggle Like"
        >
          <div className="p-1 transition-transform group-active:scale-125">
            <TikTokHeartIcon
              filled={state.isLiked}
              size={18}
              className={
                state.isLiked
                  ? 'text-[#FE2C55]'
                  : isDark
                  ? 'text-[#8a8b91] hover:text-white'
                  : 'text-[#8a8b91] hover:text-black'
              }
            />
          </div>
          <span
            className={`text-[12px] font-medium tracking-tight mt-0.5 ${
              state.isLiked ? 'text-[#FE2C55]' : subtextColor
            }`}
          >
            {state.likes}
          </span>
        </div>
      </div>
    </div>
  );
};
