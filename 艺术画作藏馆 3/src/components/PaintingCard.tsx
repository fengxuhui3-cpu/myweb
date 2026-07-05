import { useState, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Heart, ZoomIn, Calendar, User, Eye } from 'lucide-react';
import { Painting } from '../types';

interface PaintingCardProps {
  painting: Painting;
  isFavorited: boolean;
  onToggleFavorite: (id: string, e: MouseEvent) => void;
  onOpenDetails: (painting: Painting) => void;
}

export default function PaintingCard({
  painting,
  isFavorited,
  onToggleFavorite,
  onOpenDetails,
}: PaintingCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      layoutId={`card-container-${painting.id}`}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={() => onOpenDetails(painting)}
      className="group relative flex flex-col h-full overflow-hidden rounded-[24px] bg-[#0D0D0D] border border-white/5 hover:border-white/10 hover:shadow-[0_24px_48px_rgba(0,0,0,0.6)] transition-all duration-300 cursor-pointer"
    >
      {/* Artwork Image Wrapper */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
        {/* Shimmer Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/2 via-white/5 to-white/2" />
        )}
        
        <img
          src={painting.imageUrl}
          alt={painting.title}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />

        {/* Ambient Dark Overlay on Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

        {/* Floating Quick Action: Bookmark */}
        <div className="absolute top-4 right-4 z-10">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => onToggleFavorite(painting.id, e)}
            className={`flex items-center justify-center w-11 h-11 rounded-full border backdrop-blur-lg transition-all ${
              isFavorited
                ? 'bg-red-500/10 border-red-500/20 text-red-400 shadow-md shadow-red-500/5'
                : 'bg-black/60 border-white/10 text-gray-400 hover:text-[#F5F5F7] hover:bg-black/80'
            }`}
          >
            <Heart
              size={18}
              className={`transition-transform duration-300 ${
                isFavorited ? 'fill-current scale-110 text-red-400' : 'scale-100'
              }`}
            />
          </motion.button>
        </div>

        {/* Style Tag on Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 text-[10px] font-mono tracking-wide rounded-md bg-[#050505]/80 backdrop-blur-md border border-white/5 text-gray-400">
            {painting.style}
          </span>
        </div>

        {/* Hover Hover Glow Ring */}
        <div 
          className="absolute inset-0 border border-white/0 group-hover:border-white/5 rounded-[24px] transition-all duration-300 pointer-events-none"
          style={{ boxShadow: `inset 0 0 20px rgba(${painting.id === 'starry-night' ? '59,130,246' : '255,255,255'}, 0.03)` }}
        />

        {/* Quick View Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Eye size={14} className="text-white" />
            <span className="text-[10px] font-medium text-white tracking-wider uppercase">View Art</span>
          </div>
        </div>
      </div>

      {/* Artwork Information */}
      <div className="relative flex flex-col flex-grow p-5 bg-gradient-to-b from-[#0D0D0D]/40 to-[#050505]/20">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-medium text-[#F5F5F7] tracking-tight group-hover:text-white transition-colors">
            {painting.title}
          </h3>
          <span className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-500 font-mono">
            <Calendar size={10} />
            {painting.year.split(' - ')[0]}
          </span>
        </div>
        
        <p className="text-xs text-gray-400 font-medium tracking-wide mb-3 flex items-center gap-1.5">
          <User size={12} className="opacity-70 text-gray-500" />
          {painting.artist}
        </p>

        {/* Art Palette Indicator */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex -space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: painting.accentColor }} />
            <div className="w-2.5 h-2.5 rounded-full opacity-60" style={{ backgroundColor: painting.accentColor }} />
            <div className="w-2.5 h-2.5 rounded-full opacity-30" style={{ backgroundColor: painting.accentColor }} />
          </div>
          <span className="text-[9px] text-gray-500 font-mono tracking-wider uppercase">
            {painting.styleEn}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
