import React from 'react';
import { CommentState, CommentReply } from '../types';
import { TikTokVerifiedBadge, TikTokHeartIcon, TikTokPinIcon } from './TikTokBadges';
import { Camera, X, ChevronDown, ChevronUp } from 'lucide-react';

interface CommentThreadProps {
  state: CommentState;
  id?: string;
  onToggleMainLike?: () => void;
  onToggleReplyLike?: (replyId: string) => void;
  onUpdateState?: (updates: Partial<CommentState>) => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  state,
  id = 'tiktok-comment-thread',
  onToggleMainLike,
  onToggleReplyLike,
  onUpdateState,
}) => {
  const isDark = state.theme === 'dark';

  const containerBg = state.transparentBackground
    ? 'bg-transparent'
    : isDark
    ? 'bg-[#121212]'
    : 'bg-white';

  const textColor = isDark ? 'text-white' : 'text-[#161823]';
  const usernameColor = isDark ? 'text-[#e1e2e4]' : 'text-[#161823]';
  const subtextColor = isDark ? 'text-[#8a8b91]' : 'text-[#8a8b91]';

  return (
    <div
      id={id}
      className={`w-full max-w-[440px] rounded-3xl overflow-hidden shadow-2xl border transition-colors select-none ${
        isDark ? 'border-neutral-800' : 'border-neutral-200/90'
      } ${containerBg}`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "TikTok Sans", sans-serif',
      }}
    >
      {/* 1. Header Bar: "Comments 700" + Close X button */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-[16px] tracking-tight text-[#161823] dark:text-white">
            {state.commentsCountTitle || 'Comments'}
          </span>
          <span className="text-[#8a8b91] font-semibold text-[14.5px]">
            {state.totalCommentsCount || '700'}
          </span>
        </div>

        {state.showCloseButton !== false && (
          <button
            type="button"
            className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        )}
      </div>

      {/* Pinned by creator notification if present */}
      {state.pinned && (
        <div className="flex items-center gap-1.5 px-4 pt-1 text-[#8a8b91] text-[11.5px] font-medium">
          <TikTokPinIcon className="text-[#8a8b91]" />
          <span>Pinned by creator</span>
        </div>
      )}

      {/* 2. Main Parent Comment */}
      <div className="px-4 py-2 flex items-start gap-3">
        {/* Avatar with click-to-upload */}
        <div className="relative shrink-0 group pt-0.5">
          <img
            src={state.avatar}
            alt={state.name || state.username}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10"
          />
          {onUpdateState && (
            <label
              title="Change author photo"
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
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[13px] font-bold tracking-tight ${usernameColor}`}>
              {state.name || state.username}
            </span>
            {state.isVerified && <TikTokVerifiedBadge size={13} />}
            {state.isCreator && (
              <span className="px-1.5 py-0.2 text-[9.5px] font-semibold text-[#FE2C55] bg-[#FE2C55]/10 rounded tracking-tight">
                Creator
              </span>
            )}
          </div>

          {/* Comment text */}
          <p className={`mt-0.5 text-[14px] leading-[1.3] font-medium break-words whitespace-pre-wrap ${textColor}`}>
            {state.commentText}
          </p>

          {/* Optional Attachment on main comment */}
          {state.imageAttachment && (
            <div className="mt-2">
              <img
                src={state.imageAttachment}
                alt="Attachment"
                className="max-w-[200px] max-h-[220px] rounded-xl object-cover shadow-sm ring-1 ring-black/5 dark:ring-white/10"
              />
            </div>
          )}

          {/* Timestamp & Reply action */}
          <div className="mt-1 flex items-center gap-3 text-[12px] font-normal">
            <span className={subtextColor}>{state.timestamp}</span>
            <button
              type="button"
              className={`font-semibold hover:underline ${subtextColor}`}
            >
              Reply
            </button>
            {state.likedByCreator && (
              <span className="text-[11px] font-medium text-[#FE2C55]">
                Creator liked
              </span>
            )}
          </div>
        </div>

        {/* Likes on the right: Heart and count inline side-by-side */}
        <div
          onClick={onToggleMainLike}
          className="flex items-center gap-1 cursor-pointer select-none group shrink-0 pt-0.5"
        >
          <div className="transition-transform group-active:scale-125">
            <TikTokHeartIcon
              filled={state.isLiked}
              size={14}
              className={state.isLiked ? 'text-[#FE2C55]' : subtextColor}
            />
          </div>
          <span
            className={`text-[12px] font-normal ${
              state.isLiked ? 'text-[#FE2C55]' : subtextColor
            }`}
          >
            {state.likes}
          </span>
        </div>
      </div>

      {/* 3. Nested Replies Section (Indented) */}
      {state.replies && state.replies.length > 0 && (
        <div className="pl-12 pr-4 pb-2 flex flex-col gap-3.5 mt-1">
          {state.replies.map((reply: CommentReply) => (
            <div key={reply.id} className="flex items-start gap-2.5 relative">
              {/* Reply avatar */}
              <div className="relative shrink-0 group pt-0.5">
                <img
                  src={reply.avatar}
                  alt={reply.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/5"
                />
                {onUpdateState && (
                  <label
                    title="Change reply photo"
                    className="no-export absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white"
                  >
                    <Camera className="w-3 h-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              const updated = state.replies.map((r) =>
                                r.id === reply.id
                                  ? { ...r, avatar: reader.result as string }
                                  : r
                              );
                              onUpdateState({ replies: updated });
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

              {/* Reply Content Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[12px] font-bold tracking-tight ${usernameColor}`}>
                    {reply.name || reply.username}
                  </span>
                  {reply.isVerified && <TikTokVerifiedBadge size={12} />}
                  {reply.isCreator && (
                    <span className="px-1 py-0 text-[9px] font-semibold text-[#FE2C55] bg-[#FE2C55]/10 rounded tracking-tight">
                      Creator
                    </span>
                  )}
                </div>

                {/* Reply text if present */}
                {reply.text && (
                  <p
                    className={`mt-0.5 text-[13px] leading-[1.32] font-normal break-words whitespace-pre-wrap ${textColor}`}
                  >
                    {reply.text}
                  </p>
                )}

                {/* Reply Image Attachment (Sticker GIF / Photo like Birthday Cake) */}
                {reply.imageAttachment && (
                  <div className="mt-1.5 mb-1">
                    {reply.imageAttachmentType === 'sticker' ? (
                      <img
                        src={reply.imageAttachment}
                        alt="Sticker reply"
                        className="w-24 sm:w-28 h-auto object-contain drop-shadow-sm select-none"
                      />
                    ) : (
                      <img
                        src={reply.imageAttachment}
                        alt="Photo reply"
                        className="w-32 sm:w-36 max-h-44 rounded-xl object-cover shadow-sm ring-1 ring-black/5 dark:ring-white/10 select-none"
                      />
                    )}
                  </div>
                )}

                {/* Timestamp & Reply action */}
                <div className="mt-1 flex items-center gap-3 text-[11px] font-normal">
                  <span className={subtextColor}>{reply.timestamp}</span>
                  <button
                    type="button"
                    className={`font-semibold hover:underline ${subtextColor}`}
                  >
                    Reply
                  </button>

                  {reply.isLikedByCreator && (
                    <span className="text-[10px] font-medium text-[#FE2C55]">
                      Liked by creator
                    </span>
                  )}
                </div>
              </div>

              {/* Reply Likes on the right: Heart and count inline side-by-side */}
              <div
                onClick={() => onToggleReplyLike && onToggleReplyLike(reply.id)}
                className="flex items-center gap-1 cursor-pointer select-none group shrink-0 pt-0.5"
              >
                <div className="transition-transform group-active:scale-125">
                  <TikTokHeartIcon
                    filled={reply.isLiked}
                    size={13}
                    className={
                      reply.isLiked
                        ? 'text-[#FE2C55]'
                        : subtextColor
                    }
                  />
                </div>
                <span
                  className={`text-[11.5px] font-normal ${
                    reply.isLiked ? 'text-[#FE2C55]' : subtextColor
                  }`}
                >
                  {reply.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Bottom Expander / Collapsible Bar: "— View 22 more ⌵" & "Hide ⌃" */}
      {state.showBottomExpanders !== false && (
        <div className="flex items-center justify-between px-4 pt-2.5 pb-3 text-[12px] font-semibold text-[#8a8b91] select-none border-t border-black/[0.03] dark:border-white/[0.04]">
          <div className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-white cursor-pointer transition-colors">
            <div className="w-5 h-[1.5px] bg-neutral-300 dark:bg-neutral-600" />
            <span>{state.moreRepliesText || 'View 22 more'}</span>
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-1 hover:text-neutral-800 dark:hover:text-white cursor-pointer transition-colors">
            <span>Hide</span>
            <ChevronUp className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
        </div>
      )}
    </div>
  );
};
