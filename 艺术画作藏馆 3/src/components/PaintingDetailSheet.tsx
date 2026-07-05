import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MapPin, Minimize2, BookOpen, Layers, Edit3, Plus, Trash2, Tag, Compass } from 'lucide-react';
import { Painting, PaintingNote, Collection } from '../types';

interface PaintingDetailSheetProps {
  painting: Painting | null;
  onClose: () => void;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  savedNote: PaintingNote | null;
  onSaveNote: (paintingId: string, noteText: string, tags: string[]) => void;
  collections: Collection[];
  onToggleCollectionMembership: (collectionId: string, paintingId: string) => void;
}

export default function PaintingDetailSheet({
  painting,
  onClose,
  isFavorited,
  onToggleFavorite,
  savedNote,
  onSaveNote,
  collections,
  onToggleCollectionMembership,
}: PaintingDetailSheetProps) {
  const [noteText, setNoteText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Sync state with saved values
  useEffect(() => {
    if (painting) {
      setNoteText(savedNote?.noteText || '');
      setTags(savedNote?.tags || []);
      setIsEditingNote(false);
    }
  }, [painting, savedNote]);

  if (!painting) return null;

  const handleAddTag = (e: FormEvent) => {
    e.preventDefault();
    const cleanTag = tagInput.trim().toLowerCase();
    if (cleanTag && !tags.includes(cleanTag)) {
      const newTags = [...tags, cleanTag];
      setTags(newTags);
      onSaveNote(painting.id, noteText, newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((t) => t !== tagToRemove);
    setTags(newTags);
    onSaveNote(painting.id, noteText, newTags);
  };

  const handleSaveText = () => {
    onSaveNote(painting.id, noteText, tags);
    setIsEditingNote(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop glassmorphism blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Detail Card Container */}
        <motion.div
          layoutId={`card-container-${painting.id}`}
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full h-full sm:h-[90vh] max-w-6xl sm:rounded-[32px] bg-[#0D0D0D] border border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row z-10"
        >
          {/* Top/Side Dynamic Color Overlay glow */}
          <div 
            className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[150px] opacity-10 pointer-events-none"
            style={{ backgroundColor: painting.accentColor }}
          />

          {/* Left Panel: Magnificent Image View (Scrollable / Immersive) */}
          <div className="relative w-full md:w-[50%] h-[40vh] md:h-full bg-black/60 flex flex-col justify-between overflow-hidden group">
            {/* Background Blur Image */}
            <div className="absolute inset-0 opacity-20 filter blur-3xl scale-125 select-none pointer-events-none">
              <img
                src={painting.imageUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Immersive Controls */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 border border-white/5 text-gray-300 hover:text-white shadow-lg"
              >
                <X size={18} />
              </motion.button>

              <div className="flex items-center gap-2">
                {/* Style Badge */}
                <span className="px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-md bg-[#050505]/90 border border-white/5 text-gray-400 uppercase shadow-md font-mono">
                  {painting.style}
                </span>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onToggleFavorite(painting.id)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border shadow-lg transition-all ${
                    isFavorited
                      ? 'bg-red-500/15 border-red-500/30 text-red-400'
                      : 'bg-[#050505]/95 border-white/5 text-gray-400 hover:text-white hover:bg-black'
                  }`}
                >
                  <Heart size={18} className={isFavorited ? 'fill-current' : ''} />
                </motion.button>
              </div>
            </div>

            {/* Core Artwork Image container */}
            <div className="relative flex-grow flex items-center justify-center p-6 md:p-10 select-none">
              <motion.img
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                src={painting.imageUrl}
                alt={painting.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-white/5"
              />
            </div>

            {/* Dynamic Color Palette and Accent Line */}
            <div className="relative p-6 bg-gradient-to-t from-[#050505]/90 to-transparent z-10 flex flex-col gap-2">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                Art Spectrum / 色彩光谱
              </span>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full border border-white/10 shadow-inner" style={{ backgroundColor: painting.accentColor }} />
                  <div className="w-5 h-5 rounded-full border border-white/10 opacity-75" style={{ backgroundColor: painting.accentColor }} />
                  <div className="w-5 h-5 rounded-full border border-white/10 opacity-50" style={{ backgroundColor: painting.accentColor }} />
                  <div className="w-5 h-5 rounded-full border border-white/10 opacity-25" style={{ backgroundColor: painting.accentColor }} />
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {painting.accentColor}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Scrollable Info & Annotations */}
          <div className="w-full md:w-[50%] h-[60vh] md:h-full overflow-y-auto flex flex-col p-6 sm:p-8 md:p-10 scrollbar-none bg-[#0D0D0D]">
            {/* Header / Title section */}
            <div className="mb-6 pb-6 border-b border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass size={12} className="text-gray-500" />
                  Masterpiece Archive / 经典名录
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#F5F5F7] tracking-tight leading-tight">
                  {painting.title}
                </h2>
                <h3 className="text-xs sm:text-sm text-gray-500 italic leading-none font-sans mt-0.5">
                  {painting.titleEn}
                </h3>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400">
                <p className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-medium font-mono text-[10px] uppercase">Artist / 艺术家:</span>
                  <span className="font-semibold text-gray-300">{painting.artist}</span>
                  <span className="text-[10px] text-gray-500">({painting.artistEn})</span>
                </p>
              </div>
            </div>

            {/* Scientific Details / Bento list */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-3.5 rounded-2xl bg-[#050505] border border-white/5 flex flex-col gap-0.5">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen size={10} /> Created Year / 创作年代
                </span>
                <span className="text-xs font-semibold text-gray-300">{painting.year}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#050505] border border-white/5 flex flex-col gap-0.5">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <Layers size={10} /> Material / 材质媒介
                </span>
                <span className="text-xs font-semibold text-gray-300 truncate">{painting.medium}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#050505] border border-white/5 flex flex-col gap-0.5">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <Minimize2 size={10} /> Dimensions / 画幅尺寸
                </span>
                <span className="text-xs font-semibold text-gray-300">{painting.dimensions}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#050505] border border-white/5 flex flex-col gap-0.5">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={10} /> Museum / 收藏机构
                </span>
                <span className="text-xs font-semibold text-gray-300 truncate" title={painting.location}>
                  {painting.location}
                </span>
              </div>
            </div>

            {/* Description Paragraphs */}
            <div className="space-y-6 mb-8 text-sm sm:text-base leading-relaxed text-gray-300">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  Historical Background / 作品阐释
                </span>
                <p className="bg-[#050505] p-4 rounded-2xl border border-white/5 leading-relaxed text-gray-300 text-[13px]">
                  {painting.description}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  English Critique / 英文简析
                </span>
                <p className="bg-[#050505] p-4 rounded-2xl border border-white/5 leading-relaxed text-gray-400 text-[12px] italic">
                  {painting.descriptionEn}
                </p>
              </div>
            </div>

            {/* Interactive Notes & Custom Classification System */}
            <div className="mt-auto border-t border-white/5 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-[#F5F5F7] tracking-wider uppercase font-mono flex items-center gap-2">
                  <Edit3 size={14} className="text-gray-400" />
                  Studio Notes & Classification / 随笔与分类
                </h4>
                {!isEditingNote && (
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-[#050505] hover:bg-black border border-white/5 text-gray-300 hover:text-white transition-all"
                  >
                    {noteText ? '编辑笔记' : '添加笔记'}
                  </button>
                )}
              </div>

              {/* Note input/display block */}
              {isEditingNote ? (
                <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#050505] border border-white/5">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="输入关于这幅作品的心得、收藏理由或个人注释..."
                    rows={3}
                    className="w-full bg-transparent text-xs text-gray-300 focus:outline-none resize-none placeholder-gray-600 leading-relaxed"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="px-3 py-1 text-[10px] text-gray-500 hover:text-gray-300 uppercase tracking-wider font-mono"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSaveText}
                      className="px-4 py-1.5 text-[10px] font-bold rounded-full bg-[#F5F5F7] text-black hover:bg-white transition-all uppercase tracking-wider"
                    >
                      保存随笔
                    </button>
                  </div>
                </div>
              ) : (
                noteText && (
                  <div className="p-4 rounded-2xl bg-[#050505] border border-white/5 mb-4 group relative">
                    <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {noteText}
                    </p>
                    <button
                      onClick={() => {
                        setNoteText('');
                        onSaveNote(painting.id, '', tags);
                      }}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      title="清除随笔"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )
              )}

              {/* Custom Tag Section */}
              <div className="mt-4">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2">
                  My Tags / 自定义分类标签
                </span>
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-[#050505] border border-white/5 text-gray-300"
                    >
                      <Tag size={10} className="text-orange-400" />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="w-3.5 h-3.5 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-500 hover:text-white"
                      >
                        <X size={8} />
                      </button>
                    </span>
                  ))}

                  {tags.length === 0 && (
                    <span className="text-xs text-gray-600 italic">
                      暂无标签，给作品打上“治愈、灵感、写生、临摹”等自定义标签吧
                    </span>
                  )}
                </div>

                <form onSubmit={handleAddTag} className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="输入新标签名（如：最爱、临摹）"
                    maxLength={15}
                    className="flex-grow px-4 py-2 rounded-xl bg-[#050505] border border-white/5 text-xs text-[#F5F5F7] placeholder-gray-600 focus:outline-none focus:border-white/10"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-[#050505] hover:bg-black border border-white/5 text-gray-300 flex items-center justify-center transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </form>
              </div>

              {/* Collection Folder Membership Assignment */}
              <div className="mt-6 pt-5 border-t border-white/5">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2.5">
                  Aesthetic Spaces / 归属美学空间
                </span>
                
                {collections.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {collections.map((coll) => {
                      const isMember = coll.paintingIds.includes(painting.id);
                      return (
                        <button
                          key={coll.id}
                          type="button"
                          onClick={() => onToggleCollectionMembership(coll.id, painting.id)}
                          className={`px-3 py-1.5 text-xs rounded-xl border transition-all flex items-center gap-1.5 ${
                            isMember
                              ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                              : 'bg-[#050505] border-white/5 text-gray-400 hover:bg-[#121212] hover:text-[#F5F5F7]'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${isMember ? 'bg-orange-400' : 'bg-gray-600'}`} />
                          {coll.name}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 italic">
                    暂无可用的分类。在“我的工作室”标签页中新建美学分组后，即可将画作归纳到不同空间。
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
