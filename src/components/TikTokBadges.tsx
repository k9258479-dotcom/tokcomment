import React from 'react';

export const TikTokVerifiedBadge: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 14,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
  >
    <path
      d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z"
      fill="#20D5EC"
    />
    <path
      d="M11.6 5.20001L6.8 10L4.4 7.60001"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TikTokLogoIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 16,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.887 2.887 2.896 2.896 0 0 1-2.888-2.887 2.896 2.896 0 0 1 2.888-2.887c.394 0 .768.08 1.11.222V9.525a6.302 6.302 0 0 0-1.11-.098 6.332 6.332 0 0 0-6.332 6.332 6.332 6.332 0 0 0 6.332 6.332 6.332 6.332 0 0 0 6.332-6.332V8.924a8.167 8.167 0 0 0 5.097 1.762V7.24a4.807 4.807 0 0 1-1.317-.554z"
      fill="currentColor"
    />
  </svg>
);

export const TikTokPinIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="17" x2="12" y2="22" />
    <path d="M5 17h14v-1.76a2 2 0 0 0-.586-1.414L16 11.414V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5.414l-2.414 2.414A2 2 0 0 0 5 15.24V17z" />
  </svg>
);

export const TikTokHeartIcon: React.FC<{ filled?: boolean; size?: number; className?: string }> = ({
  filled = false,
  size = 18,
  className = '',
}) => {
  if (filled) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="#FE2C55"
        className={`shrink-0 ${className}`}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
};
