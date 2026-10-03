export type VideoSourceType = 'google_drive' | 'youtube' | 'direct_video' | 'unknown';

export interface VideoInfo {
  type: VideoSourceType;
  embedUrl: string;
  originalUrl: string;
  driveFileId?: string;
  youtubeId?: string;
  isValid: boolean;
}

/**
 * Parses any video URL (Google Drive, YouTube, YouTube Shorts, Direct MP4, etc.)
 * and transforms it into the correct embeddable playback URL.
 */
export function parseVideoUrl(url?: string): VideoInfo {
  if (!url || typeof url !== 'string') {
    return { type: 'unknown', embedUrl: '', originalUrl: '', isValid: false };
  }
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    return { type: 'unknown', embedUrl: '', originalUrl: '', isValid: false };
  }

  // 1. Google Drive Detection
  // Common patterns:
  // - https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing
  // - https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/edit
  // - https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview
  // - https://drive.google.com/open?id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs
  // - https://drive.google.com/uc?id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs
  const driveFileMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  const driveIdMatch = cleanUrl.match(/drive\.google\.com\/(?:open|uc)\?(?:[^&]*&)*id=([a-zA-Z0-9_-]+)/);
  const driveFileId = driveFileMatch?.[1] || driveIdMatch?.[1];

  if (driveFileId) {
    return {
      type: 'google_drive',
      driveFileId,
      embedUrl: `https://drive.google.com/file/d/${driveFileId}/preview`,
      originalUrl: cleanUrl,
      isValid: true,
    };
  }

  // 2. YouTube & YouTube Shorts Detection
  // Patterns:
  // - https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // - https://youtu.be/dQw4w9WgXcQ
  // - https://www.youtube.com/shorts/dQw4w9WgXcQ
  // - https://www.youtube.com/embed/dQw4w9WgXcQ
  const ytMatch = cleanUrl.match(
    /(?:youtube\.com\/(?:watch\?(?:[^&]*&)*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch?.[1]) {
    const youtubeId = ytMatch[1];
    return {
      type: 'youtube',
      youtubeId,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`,
      originalUrl: cleanUrl,
      isValid: true,
    };
  }

  // 3. Direct video format or normal web URL (MP4, WebM, etc.)
  return {
    type: 'direct_video',
    embedUrl: cleanUrl,
    originalUrl: cleanUrl,
    isValid: true,
  };
}
