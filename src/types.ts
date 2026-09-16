export type DisplayMode = 'sticker' | 'single' | 'thread';
export type ThemeMode = 'dark' | 'light';
export type Platform = 'tiktok' | 'instagram' | 'youtube';

export interface CommentReply {
  id: string;
  avatar: string;
  name: string;
  username: string;
  text: string;
  likes: string;
  isLiked: boolean;
  timestamp: string;
  isCreator: boolean;
  isVerified: boolean;
  isLikedByCreator?: boolean;
}

export interface CommentState {
  mode: DisplayMode;
  theme: ThemeMode;
  platform: Platform;

  // User details
  avatar: string;
  name: string;
  username: string;
  isVerified: boolean;
  isCreator: boolean;
  pinned: boolean;

  // Content
  commentText: string;
  timestamp: string;
  likes: string;
  isLiked: boolean;

  // Creator like
  likedByCreator: boolean;
  creatorAvatar: string;
  creatorName: string;

  // Replies
  replies: CommentReply[];
  showReplyCount: boolean;
  totalRepliesCount: string;

  // Sticker specific
  replyingToHandle: string;
  replyHeaderFormat: 'reply_to_user' | 'replying_to_handle' | 'custom';
  customReplyHeaderText?: string;
  showSpeechBubbleTail: boolean;
  showTikTokLogoOnSticker: boolean;
  stickerCardBg: string; // 'auto', 'white', 'dark'
  stickerHasShadow: boolean;
  stickerBorderRadius: number; // in px, default 18
  stickerFontSize: number; // default 21
  transparentBackground: boolean;

  // Export & View
  previewScale: number;
  previewBgType: 'tokcomment_dark' | 'checkerboard' | 'solid' | 'video';
  videoUrl: string;
}

export interface PresetAvatar {
  id: string;
  name: string;
  url: string;
  category: 'girls' | 'guys' | 'memes' | 'creators';
}

export interface CommentPreset {
  title: string;
  category: string;
  name: string;
  username: string;
  commentText: string;
  likes: string;
  timestamp: string;
  isVerified?: boolean;
  isCreator?: boolean;
  likedByCreator?: boolean;
  pinned?: boolean;
}
