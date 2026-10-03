import React, { useState, useRef } from 'react';
import { Language, PortfolioItem, SiteUIConfig } from '../types';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';
import { parseVideoUrl } from '../utils/videoHelper';
import { Play, Pause, Volume2, VolumeX, Sparkles, Film, CheckCircle2, SlidersHorizontal, ExternalLink } from 'lucide-react';

interface VideoShowcaseProps {
  items: PortfolioItem[];
  lang: Language;
  uiConfig?: SiteUIConfig;
  onOrderVideo: (videoItem?: PortfolioItem) => void;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  items,
  lang,
  uiConfig,
  onOrderVideo,
}) => {
  const videoItems = items.filter((i) => i.category === 'video');
  const [selectedVideo, setSelectedVideo] = useState<PortfolioItem>(
    videoItems[0] || items[0]
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [colorGradeActive, setColorGradeActive] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSelectVideo = (item: PortfolioItem) => {
    setSelectedVideo(item);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <section id="video-reels" className="py-20 bg-neutral-900/50 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
              {lang === 'gu'
                ? (uiConfig?.videoContent?.badgeGu || 'વિડિઓ એડિટિંગ સ્ટુડિયો')
                : (uiConfig?.videoContent?.badgeEn || 'Cinematic Video Editing')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              {lang === 'gu'
                ? (uiConfig?.videoContent?.headlineGu || 'ઇન્સ્ટા રીલ્સ & સિનેમેટિક વિડિઓઝ')
                : (uiConfig?.videoContent?.headlineEn || 'Viral Reels & Event Teasers')}
            </h2>
          </div>

          <p className="text-sm text-neutral-400 max-w-md">
            {lang === 'gu'
              ? (uiConfig?.videoContent?.subheadGu || 'પ્રોફેશનલ કટ, સાઉન્ડ ડિઝાઇન, અને કલર ગ્રેડિંગ સાથે તમારા વિડિઓઝને વાઇરલ બનાવો.')
              : (uiConfig?.videoContent?.subheadEn || 'Turn raw camera clips into captivating viral reels with rhythm syncing, motion titles, and cinematic color science.')}
          </p>
        </div>

        {/* Video Reel Player Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Reel Viewport / Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden border-4 border-neutral-800 bg-neutral-950 shadow-2xl">
              
              {/* Actual Video or Fallback Poster */}
              {selectedVideo.videoUrl ? (
                (() => {
                  const videoInfo = parseVideoUrl(selectedVideo.videoUrl);
                  const isEmbed = videoInfo.type === 'google_drive' || videoInfo.type === 'youtube';

                  if (isEmbed) {
                    return (
                      <UniversalVideoPlayer
                        videoUrl={selectedVideo.videoUrl}
                        posterImage={selectedVideo.image}
                        title={selectedVideo.title}
                        className="w-full h-full"
                        showDriveBadge={false}
                      />
                    );
                  }

                  return (
                    <>
                      <video
                        ref={videoRef}
                        src={selectedVideo.videoUrl}
                        poster={selectedVideo.image}
                        loop
                        playsInline
                        muted={isMuted}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          colorGradeActive
                            ? 'contrast-105 saturate-110'
                            : 'grayscale-40 contrast-90 brightness-95'
                        }`}
                        onClick={togglePlay}
                      />
                      {/* Scrim Overlay for Direct Video */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/40" />

                      {/* Play / Pause Center Trigger for Direct Video */}
                      <button
                        onClick={togglePlay}
                        type="button"
                        className={`absolute inset-0 m-auto w-14 h-14 rounded-full bg-amber-400/90 text-neutral-950 flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer z-10 ${
                          isPlaying ? 'opacity-0 hover:opacity-90' : 'opacity-90'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-neutral-950 ml-1" />}
                      </button>
                    </>
                  );
                })()
              ) : (
                <>
                  <img
                    src={selectedVideo.image}
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/40" />
                </>
              )}

              {/* Bottom Reel Metadata */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="text-xs font-bold text-white mb-1 line-clamp-1">
                  {lang === 'gu' ? selectedVideo.titleGu : selectedVideo.title}
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-300">
                  <span>{selectedVideo.duration || '0:30'}</span>
                  <span className="text-amber-400 font-bold tabular-nums">₹{selectedVideo.price}</span>
                </div>
              </div>

            </div>

            {/* Quick Caption */}
            <p className="text-[11px] text-neutral-500 mt-3 text-center">
              {lang === 'gu' ? '👆 વિડિઓ ચાલુ કરવા ક્લિક કરો | સાઉન્ડ & ગ્રેડિંગ ટેસ્ટ' : '👆 Click video to play/pause with sound'}
            </p>
          </div>

          {/* Right Column: Video Features & Selector List */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            
            {/* Active Video Info Card */}
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="text-xl font-bold text-white">
                  {lang === 'gu' ? selectedVideo.titleGu : selectedVideo.title}
                </h3>
                <span className="text-lg font-extrabold text-amber-400 tabular-nums">
                  ₹{selectedVideo.price}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                {lang === 'gu' ? selectedVideo.descriptionGu : selectedVideo.description}
              </p>

              {/* Tech Inclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lang === 'gu' ? 'ડાયનામિક સબટાઈટલ & ટેક્સ્ટ હાઈલાઈટ' : 'Dynamic Animated Captions'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lang === 'gu' ? 'મ્યુઝિક બીટ સિંક & સાઉન્ડ SFX' : 'Beat-Synced Sound Design'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lang === 'gu' ? 'સિનેમેટિક કલર ગ્રેડિંગ (LUTs)' : 'Cinematic Color Grading'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lang === 'gu' ? 'HD & 4K વર્ટિકલ/હોરિઝોન્ટલ એક્સપોર્ટ' : 'Full HD/4K Multi-format Export'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => onOrderVideo(selectedVideo)}
                  type="button"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  <Film className="w-4 h-4" />
                  <span>{lang === 'gu' ? 'આવા વિડિઓનો ઓર્ડર કરો' : 'Order This Video Edit'}</span>
                </button>

                <div className="text-xs text-neutral-400">
                  <span>{lang === 'gu' ? 'ડિલિવરી:' : 'Turnaround:'}</span>{' '}
                  <strong className="text-white">{lang === 'gu' ? selectedVideo.deliveryTimeGu : selectedVideo.deliveryTime}</strong>
                </div>
              </div>
            </div>

            {/* Video Playlist Selector */}
            <div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                {lang === 'gu' ? 'અન્ય વિડિઓ સેમ્પલ પસંદ કરો:' : 'Select Other Video Showcases:'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {videoItems.map((item) => {
                  const isCurrent = item.id === selectedVideo.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectVideo(item)}
                      type="button"
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-400/10'
                          : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-950 shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">
                          {lang === 'gu' ? item.titleGu : item.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1.5">
                          <span>{item.duration || 'Reel'}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-bold">₹{item.price}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
