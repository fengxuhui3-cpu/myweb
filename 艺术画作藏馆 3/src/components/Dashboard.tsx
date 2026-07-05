import { FormEvent } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Library, Heart, Palette, FolderHeart, CalendarRange, Trash2, ArrowRight } from 'lucide-react';
import { Painting, Collection } from '../types';

interface DashboardProps {
  favoritePaintings: Painting[];
  collections: Collection[];
  onCreateCollection: (name: string, description?: string) => void;
  onDeleteCollection: (id: string) => void;
  onSelectCollection: (collectionId: string | null) => void;
  selectedCollectionId: string | null;
  paintings: Painting[];
}

export default function Dashboard({
  favoritePaintings,
  collections,
  onCreateCollection,
  onDeleteCollection,
  onSelectCollection,
  selectedCollectionId,
  paintings,
}: DashboardProps) {
  // 1. Calculate statistical summaries
  const totalSaved = favoritePaintings.length;
  
  // Preferred style
  const styleCount: { [key: string]: number } = {};
  favoritePaintings.forEach((p) => {
    styleCount[p.style] = (styleCount[p.style] || 0) + 1;
  });
  const sortedStyles = Object.entries(styleCount).sort((a, b) => b[1] - a[1]);
  const preferredStyle = sortedStyles.length > 0 ? sortedStyles[0][0] : '尚无数据';

  // Total artists collected
  const uniqueArtists = Array.from(new Set(favoritePaintings.map((p) => p.artist))).length;

  // Timeline range
  const years = favoritePaintings
    .map((p) => parseInt(p.year.split(' - ')[0]) || 0)
    .filter((y) => y > 0)
    .sort((a, b) => a - b);
  const timeSpanText =
    years.length > 0
      ? `${years[0]}年 - ${years[years.length - 1]}年`
      : '尚无年份数据';

  // Handle new collection form submission
  const handleCreateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const desc = formData.get('desc') as string;
    if (name.trim()) {
      onCreateCollection(name, desc);
      e.currentTarget.reset();
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Bento Grid Analytics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Masterpieces */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="p-5 rounded-[20px] bg-[#0D0D0D] border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              Bookmarks / 收藏总数
            </span>
            <Heart size={14} className="text-red-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-light text-[#F5F5F7] leading-none font-sans">
              {totalSaved}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">幅画作</span>
          </div>
        </motion.div>

        {/* Card 2: Favorite Style */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-5 rounded-[20px] bg-[#0D0D0D] border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              Fav Style / 偏爱风格
            </span>
            <Palette size={14} className="text-orange-400" />
          </div>
          <div className="flex flex-col mt-2">
            <span className="text-sm font-medium text-[#F5F5F7] tracking-tight leading-tight truncate">
              {preferredStyle}
            </span>
            <span className="text-[9px] font-mono text-gray-500 mt-1">
              {totalSaved > 0 ? `收藏中有 ${styleCount[preferredStyle] || 0} 幅属于此风格` : '等待你点亮第一颗心'}
            </span>
          </div>
        </motion.div>

        {/* Card 3: Artists collected */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="p-5 rounded-[20px] bg-[#0D0D0D] border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              Artists / 触及艺术大师
            </span>
            <Library size={14} className="text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-light text-[#F5F5F7] leading-none font-sans">
              {uniqueArtists}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">位</span>
          </div>
        </motion.div>

        {/* Card 4: Historical Span */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-5 rounded-[20px] bg-[#0D0D0D] border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              Time Era / 纵贯时空跨度
            </span>
            <CalendarRange size={14} className="text-emerald-400" />
          </div>
          <div className="flex flex-col mt-2">
            <span className="text-xs font-semibold text-[#F5F5F7] tracking-tight leading-tight">
              {timeSpanText}
            </span>
            <span className="text-[9px] font-mono text-gray-500 mt-1">
              {totalSaved > 0 ? '艺术长河的收藏结晶' : '从文艺复兴到浮世绘'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Studio Organizer splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section: Create Custom Folder & Folder list */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-[24px] bg-[#0D0D0D] border border-white/5">
            <h3 className="text-xs font-bold text-[#F5F5F7] tracking-wider uppercase font-mono mb-4 flex items-center gap-2">
              <FolderHeart size={16} className="text-rose-400" />
              New Collection / 新建分类
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                  Collection Name / 分组名称
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="例如：客厅灵感、睡前静心、待临摹..."
                  maxLength={15}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-white/5 focus:border-white/10 text-sm text-[#F5F5F7] placeholder-gray-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                  Description / 简介说明 (可选)
                </label>
                <input
                  type="text"
                  name="desc"
                  placeholder="关于这个专属美学空间的定义..."
                  maxLength={40}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-white/5 focus:border-white/10 text-sm text-[#F5F5F7] placeholder-gray-600 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#F5F5F7] text-black hover:bg-white text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                新建美学空间
                <ArrowRight size={12} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Section: Collections grid and selector */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-base font-medium text-[#F5F5F7] tracking-tight leading-tight mb-1">
              美学收纳盒 / My Premium Collections
            </h3>
            <p className="text-xs text-gray-500 font-mono">
              将喜爱的绘画分类归纳到对应美学空间，可随时在画作卡片或详情页中进行微调
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Folder 1: Default Favorite All Folder */}
            <motion.div
              onClick={() => onSelectCollection(null)}
              className={`p-5 rounded-[24px] border cursor-pointer transition-all ${
                selectedCollectionId === null
                  ? 'bg-[#151515] border-white/10 shadow-lg shadow-black/40'
                  : 'bg-[#0D0D0D] border-white/5 hover:bg-[#121212] hover:border-white/8'
              } flex flex-col justify-between h-44`}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Heart size={18} className="fill-current" />
                </div>
                <span className="text-[10px] font-mono font-medium text-gray-400 bg-white/5 px-2.5 py-1 rounded-full">
                  {favoritePaintings.length}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F5F5F7]">所有我的收藏</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  包含所有打上心形收藏标记的美学名画。
                </p>
              </div>
            </motion.div>

            {/* Iterating Custom collections */}
            {collections.map((coll) => {
              // Get the first painting in the collection to use as cover thumbnail
              const coverPainting = paintings.find((p) => coll.paintingIds.includes(p.id));
              
              return (
                <motion.div
                  key={coll.id}
                  onClick={() => onSelectCollection(coll.id)}
                  className={`p-5 rounded-[24px] border cursor-pointer relative overflow-hidden transition-all flex flex-col justify-between h-44 ${
                    selectedCollectionId === coll.id
                      ? 'bg-[#151515] border-white/10 shadow-lg shadow-black/40'
                      : 'bg-[#0D0D0D] border-white/5 hover:bg-[#121212] hover:border-white/8'
                  }`}
                >
                  {/* Miniature Cover background */}
                  {coverPainting && (
                    <div className="absolute inset-0 opacity-[0.08] pointer-events-none select-none blur-sm">
                      <img
                        src={coverPainting.imageUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="relative flex items-start justify-between z-10">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center font-mono font-bold text-sm">
                      {coll.name.substring(0, 1)}
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-medium text-gray-400 bg-white/5 px-2.5 py-1 rounded-full">
                        {coll.paintingIds.length}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCollection(coll.id);
                        }}
                        className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all"
                        title="删除此分类"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-sm font-semibold text-[#F5F5F7]">{coll.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {coll.description || '暂无分组说明，开启属于你的美学探索之旅。'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {collections.length === 0 && (
            <div className="p-8 rounded-2xl bg-[#0D0D0D] border border-white/5 border-dashed text-center flex flex-col items-center justify-center gap-2">
              <Sparkles size={24} className="text-gray-600 animate-pulse" />
              <p className="text-xs text-gray-500">
                你还没有建立自定义分类。通过左侧表单可以立即建立，例如“古典主义”、“色彩美学”等。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
