import React, { useState } from 'react';
import { parseVideoUrl } from '../utils/videoHelper';
import { Play, ExternalLink, AlertTriangle } from 'lucide-react';

interface UniversalVideoPlayerProps {
  videoUrl?: string;
  posterImage?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  showDriveBadge?: boolean;
}

export const UniversalVideoPlayer: React.FC<UniversalVideoPlayerProps> = ({
  videoUrl,
  posterImage,
  title,
  className = '',
  autoPlay = false,
  muted = true,
  loop = true,
  controls = true,
  showDriveBadge = true,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [hasError, setHasError] = useState<boolean>(false);

  if (!videoUrl) {
    return (
      <div className={`relative w-full h-full bg-neutral-950 flex items-center justify-center ${className}`}>
        {posterImage ? (
          <img src={posterImage} alt={title || 'Video Poster'} className="w-full h-full object-cover" />
        ) : (
          <span className="text-neutral-500 text-xs">કોઈ વિડિઓ ઉપલબ્ધ નથી</span>
        )}
      </div>
    );
  }

  const videoInfo = parseVideoUrl(videoUrl);

  // 1. Google Drive Video
  if (videoInfo.type === 'google_drive') {
    return (
      <div className={`relative w-full h-full bg-neutral-950 overflow-hidden flex flex-col justify-center ${className}`}>
        <iframe
          src={videoInfo.embedUrl}
          title={title || 'Google Drive Video Player'}
          className="w-full h-full border-0 rounded-none"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          onError={() => setHasError(true)}
        />

        {showDriveBadge && (
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-[10px] text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Google Drive</span>
            <a
              href={videoInfo.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white ml-0.5"
              title="Open directly in Drive"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    );
  }

  // 2. YouTube Video
  if (videoInfo.type === 'youtube') {
    return (
      <div className={`relative w-full h-full bg-neutral-950 overflow-hidden ${className}`}>
        <iframe
          src={videoInfo.embedUrl}
          title={title || 'YouTube Video Player'}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // 3. Direct MP4 / WebM Video
  return (
    <div className={`relative w-full h-full bg-neutral-950 overflow-hidden group ${className}`}>
      {!isPlaying && posterImage ? (
        <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
          <img src={posterImage} alt={title || 'Video'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-neutral-950/30 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-neutral-950 ml-1" />
            </div>
          </div>
        </div>
      ) : (
        <video
          src={videoInfo.embedUrl}
          poster={posterImage}
          controls={controls}
          autoPlay={autoPlay || isPlaying}
          muted={muted}
          loop={loop}
          playsInline
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      )}

      {hasError && (
        <div className="absolute bottom-2 left-2 right-2 p-2 rounded bg-neutral-900/90 border border-red-500/40 text-[11px] text-red-300 flex items-center gap-1.5 z-20">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
          <span>વિડિઓ લોડ કરવામાં સમસ્યા. ફાઇલ પબ્લિક 'Anyone with link' હોવી જરૂરી છે.</span>
        </div>
      )}
    </div>
  );
};
