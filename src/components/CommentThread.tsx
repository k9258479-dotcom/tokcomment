import React from 'react';
import { CommentState, CommentReply } from '../types';
import { CommentFeedItem } from './CommentFeedItem';
import { TikTokVerifiedBadge, TikTokHeartIcon } from './TikTokBadges';
import { Camera } from 'lucide-react';

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
  const subtextColor = isDark ? 'text-[#8a8b91]' : 'text-[#8a8b91]';
  const nameColor = isDark ? 'text-[#e1e2e4]' : 'text-[#161823]';

  return (
    <div
      id={id}
      className={`w-full max-w-[480px] rounded-xl overflow-hidden ${containerBg}`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "TikTok Sans", sans-serif',
      }}
    >
      {/* Main parent comment */}
      <CommentFeedItem
        state={state}
        id="tiktok-parent-comment"
        onToggleLike={onToggleMainLike}
        onUpdateState={onUpdateState}
      />

      {/* Replies section */}
      {state.replies && state.replies.length > 0 && (
        <div className="pl-12 pr-4 pb-3 flex flex-col gap-3">
          {state.replies.map((reply: CommentReply) => (
            <div key={reply.id} className="flex items-start gap-3 relative">
              {/* Left subtle vertical connection line */}
              <div className="relative shrink-0 group">
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

              {/* Reply Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[12px] font-bold tracking-tight ${nameColor}`}>
                    {reply.name || reply.username}
                  </span>
                  {reply.isVerified && <TikTokVerifiedBadge size={12} />}
                  {reply.isCreator && (
                    <span className="px-1 py-0 text-[9px] font-semibold text-[#FE2C55] bg-[#FE2C55]/10 rounded tracking-tight">
                      Creator
                    </span>
                  )}
                </div>

                <p
                  className={`mt-0.5 text-[13.5px] leading-[1.38] break-words whitespace-pre-wrap ${textColor}`}
                >
                  {reply.text}
                </p>

                <div className="mt-1.5 flex items-center gap-3 text-[11px] font-normal">
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

              {/* Reply Likes */}
              <div
                onClick={() => onToggleReplyLike && onToggleReplyLike(reply.id)}
                className="flex flex-col items-center justify-center cursor-pointer select-none group shrink-0"
              >
                <div className="p-0.5 transition-transform group-active:scale-125">
                  <TikTokHeartIcon
                    filled={reply.isLiked}
                    size={15}
                    className={
                      reply.isLiked
                        ? 'text-[#FE2C55]'
                        : isDark
                        ? 'text-[#8a8b91]'
                        : 'text-[#8a8b91]'
                    }
                  />
                </div>
                <span
                  className={`text-[11px] font-medium mt-0.5 ${
                    reply.isLiked ? 'text-[#FE2C55]' : subtextColor
                  }`}
                >
                  {reply.likes}
                </span>
              </div>
            </div>
          ))}

          {/* View more replies button */}
          {state.showReplyCount && (
            <button
              type="button"
              className="text-left text-[12px] font-semibold text-[#8a8b91] hover:text-[#FE2C55] flex items-center gap-1.5 transition-colors pt-1"
            >
              <div className="w-6 h-[1px] bg-neutral-300 dark:bg-neutral-700" />
              <span>View {state.totalRepliesCount || '14'} more replies</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
