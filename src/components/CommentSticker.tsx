import React from 'react';
import { CommentState } from '../types';
import { TikTokVerifiedBadge, TikTokLogoIcon } from './TikTokBadges';

interface CommentStickerProps {
  state: CommentState;
  id?: string;
  onUpdateState?: (updates: Partial<CommentState>) => void;
  isEditable?: boolean;
}

export const CommentSticker: React.FC<CommentStickerProps> = ({
  state,
  id = 'tiktok-comment-sticker',
  onUpdateState,
  isEditable = false,
}) => {
  const isDark = state.theme === 'dark';

  // Card background hex and classes
  const isDarkCard =
    state.stickerCardBg === 'dark' || (state.stickerCardBg === 'auto' && isDark);

  const cardBgHex = isDarkCard ? '#1e1f24' : '#ffffff';

  const textColor = isDarkCard ? 'text-white' : 'text-black';
  const headerGray = isDarkCard ? 'text-neutral-400' : 'text-[#60626a]';
  const headerUserColor = isDarkCard ? 'text-neutral-100' : 'text-[#2e3036]';

  const borderRadius = state.stickerBorderRadius ?? 18;
  const fontSize = state.stickerFontSize ?? 21;
  const showTail = state.showSpeechBubbleTail ?? true;

  // Header display logic (e.g. "Reply to username's comment" like in screenshot)
  const cleanUsername = state.username.replace(/^@/, '') || 'username';

  const renderHeader = () => {
    if (state.replyHeaderFormat === 'replying_to_handle') {
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[13.5px] font-medium ${headerGray} leading-tight`}>
            Replying to
          </span>
          <span
            className={`text-[13.5px] font-bold leading-tight flex items-center gap-1 ${headerUserColor}`}
          >
            @{cleanUsername}
            {state.isVerified && <TikTokVerifiedBadge size={13} />}
          </span>
        </div>
      );
    }

    if (state.replyHeaderFormat === 'custom' && state.customReplyHeaderText) {
      return (
        <div className={`text-[14px] font-semibold ${headerGray} leading-tight`}>
          {state.customReplyHeaderText}
        </div>
      );
    }

    // Default: "Reply to {username}'s comment" (The exact authentic TikTok reply sticker style)
    return (
      <div className={`text-[14px] sm:text-[14.5px] font-bold ${headerGray} leading-tight flex items-center gap-1 flex-wrap`}>
        <span>Reply to</span>
        <span className={`font-extrabold ${headerUserColor} flex items-center gap-1`}>
          {cleanUsername}'s
          {state.isVerified && <TikTokVerifiedBadge size={13} />}
        </span>
        <span>comment</span>
      </div>
    );
  };

  return (
    <div
      id={id}
      className={`relative inline-block w-full max-w-[450px] min-w-[300px] transition-colors duration-150 select-none ${
        state.stickerHasShadow ? 'filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.18)]' : ''
      }`}
      style={{
        backgroundColor: cardBgHex,
        borderTopLeftRadius: `${borderRadius}px`,
        borderTopRightRadius: `${borderRadius}px`,
        borderBottomRightRadius: `${borderRadius}px`,
        // Bottom left corner is unrounded when the speech bubble tail is visible
        borderBottomLeftRadius: showTail ? '0px' : `${borderRadius}px`,
        padding: '16px 20px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "TikTok Sans", sans-serif',
      }}
    >
      <div className="flex items-start gap-3.5">
        {/* Author Avatar */}
        <div className="relative shrink-0 pt-0.5">
          <img
            src={state.avatar}
            alt={state.name || cleanUsername}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10 shadow-sm"
          />
        </div>

        {/* Text Body */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Header info */}
          {renderHeader()}

          {/* Comment text */}
          {isEditable && onUpdateState ? (
            <textarea
              rows={2}
              value={state.commentText}
              onChange={(e) => onUpdateState({ commentText: e.target.value })}
              className={`mt-1.5 w-full bg-transparent border-none outline-none resize-none font-extrabold tracking-[-0.02em] leading-[1.26] ${textColor}`}
              style={{ fontSize: `${fontSize}px` }}
              placeholder="Write any comment..."
            />
          ) : (
            <p
              className={`mt-1.5 font-extrabold tracking-[-0.02em] leading-[1.26] break-words whitespace-pre-wrap ${textColor}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {state.commentText}
            </p>
          )}

          {/* Optional bottom meta: Liked by creator */}
          {state.likedByCreator && (
            <div className="mt-3 flex items-center gap-1.5">
              <div className="relative shrink-0">
                <img
                  src={state.creatorAvatar || state.avatar}
                  alt="Creator"
                  referrerPolicy="no-referrer"
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#FE2C55] rounded-full flex items-center justify-center text-[7px] text-white">
                  ♥
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#FE2C55]">
                Liked by creator
              </span>
            </div>
          )}
        </div>

        {/* Top-right TikTok Branding (Optional toggle) */}
        {state.showTikTokLogoOnSticker && (
          <div
            className={`shrink-0 p-1.5 rounded-full ${
              isDarkCard ? 'bg-white/10 text-white' : 'bg-neutral-100 text-neutral-800'
            }`}
            title="TikTok Comment Sticker"
          >
            <TikTokLogoIcon size={14} />
          </div>
        )}
      </div>

      {/* Signature TikTok Speech Bubble Tail at bottom-left */}
      {showTail && (
        <div className="absolute left-0 -bottom-[15px] w-8 h-4 overflow-visible pointer-events-none">
          <svg
            width="32"
            height="16"
            viewBox="0 0 32 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            {/* Seamless tail path connected directly to card bottom-left */}
            <path
              d="M0 0 L0 12 C0 15 1.8 16.2 3.2 14.8 L20 0 Z"
              fill={cardBgHex}
            />
          </svg>
        </div>
      )}
    </div>
  );
};
