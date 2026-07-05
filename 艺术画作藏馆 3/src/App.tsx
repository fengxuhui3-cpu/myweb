import { useState, useEffect, useMemo, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Heart, 
  Sparkles, 
  Layers, 
  SlidersHorizontal, 
  RefreshCw, 
  Compass, 
  Sliders, 
  X,
  Palette,
  Clock,
  BookOpen
} from 'lucide-react';

import BackgroundEffect from './components/BackgroundEffect';
import PaintingCard from './components/PaintingCard';
import PaintingDetailSheet from './components/PaintingDetailSheet';
import Dashboard from './components/Dashboard';

import { PAINTINGS, ART_STYLES, ARTISTS } from './data/paintings';
import { Painting, Collection, PaintingNote, ActiveTab } from './types';

export default function App() {
  // --- STATE DECLARATIONS ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [timeString, setTimeString] = useState('');

  // 1. Favorites list (persistent)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('art_favorites');
    return saved ? JSON.parse(saved) : ['starry-night', 'mona-lisa', 'persistence-of-memory'];
  });

  // 2. Custom Folders/Collections list (persistent, with premium default seeds)
  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('art_collections');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'living-room',
        name: '客厅挂画灵感',
        description: '为明亮宽敞的客厅空间挑选具有强烈光影和治愈力量的古典杰作。',
        paintingIds: ['starry-night', 'impression-sunrise'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'classic-portraits',
        name: '古典人像美学',
        description: '品味文艺复兴与巴洛克时期肖像画中微妙的情感起伏与细节刻画。',
        paintingIds: ['mona-lisa', 'girl-pearl-earring'],
        createdAt: new Date().toISOString(),
      }
    ];
  });

  // 3. Notes and Tags on individual paintings (persistent)
  const [notes, setNotes] = useState<PaintingNote[]>(() => {
    const saved = localStorage.getItem('art_notes');
    return saved ? JSON.parse(saved) : [
      {
        paintingId: 'starry-night',
        noteText: '梵高在圣雷米疗养院的星空。旋转的涡流是深邃的精神呐喊，黄色与深蓝色的色彩对立，充满了浪漫而痛苦的诗意！',
        tags: ['临摹计划', '超凡色彩'],
        updatedAt: new Date().toISOString()
      },
      {
        paintingId: 'girl-pearl-earring',
        noteText: '回眸的瞬间微张的嘴唇，和那颗反射高光的珍珠，维米尔将光线凝聚到了极致。',
        tags: ['唯美', '光影研究'],
        updatedAt: new Date().toISOString()
      }
    ];
  });

  // --- SYNC TO STORAGE ---
  useEffect(() => {
    localStorage.setItem('art_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('art_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('art_notes', JSON.stringify(notes));
  }, [notes]);

  // --- iOS SYSTEM CLOCK EFFECT ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- DYNAMIC CALCULATED VALUES ---
  const favoritePaintings = useMemo(() => {
    return PAINTINGS.filter((p) => favorites.includes(p.id));
  }, [favorites]);

  const activeCollection = useMemo(() => {
    if (!selectedCollectionId) return null;
    return collections.find((c) => c.id === selectedCollectionId) || null;
  }, [selectedCollectionId, collections]);

  const filteredPaintings = useMemo(() => {
    let list = PAINTINGS;

    // Filter by Tab & Collections first
    if (activeTab === 'studio') {
      if (selectedCollectionId) {
        const targetCollection = collections.find((c) => c.id === selectedCollectionId);
        const allowedIds = targetCollection ? targetCollection.paintingIds : [];
        list = list.filter((p) => allowedIds.includes(p.id));
      } else {
        list = list.filter((p) => favorites.includes(p.id));
      }
    }

    // Filter by Style
    if (selectedStyle) {
      list = list.filter((p) => p.style === selectedStyle);
    }

    // Filter by Artist
    if (selectedArtist) {
      list = list.filter((p) => p.artist === selectedArtist);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.titleEn.toLowerCase().includes(q) ||
          p.artist.toLowerCase().includes(q) ||
          p.artistEn.toLowerCase().includes(q) ||
          p.style.toLowerCase().includes(q) ||
          p.styleEn.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTab, selectedCollectionId, selectedStyle, selectedArtist, searchQuery, favorites, collections]);

  // --- INTERACTION HANDLERS ---
  const handleToggleFavorite = (id: string, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleCreateCollection = (name: string, description?: string) => {
    const newColl: Collection = {
      id: `coll-${Date.now()}`,
      name,
      description,
      paintingIds: [],
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, newColl]);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    if (selectedCollectionId === id) {
      setSelectedCollectionId(null);
    }
  };

  const handleToggleCollectionMembership = (collectionId: string, paintingId: string) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === collectionId) {
          const exists = c.paintingIds.includes(paintingId);
          const newIds = exists
            ? c.paintingIds.filter((id) => id !== paintingId)
            : [...c.paintingIds, paintingId];
          return { ...c, paintingIds: newIds };
        }
        return c;
      })
    );
  };

  const handleSaveNote = (paintingId: string, noteText: string, tags: string[]) => {
    setNotes((prev) => {
      const existingIndex = prev.findIndex((n) => n.paintingId === paintingId);
      const updatedNote: PaintingNote = {
        paintingId,
        noteText,
        tags,
        updatedAt: new Date().toISOString(),
      };
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex] = updatedNote;
        return copy;
      } else {
        return [...prev, updatedNote];
      }
    });
  };

  const handleResetFilters = () => {
    setSelectedStyle(null);
    setSelectedArtist(null);
    setSearchQuery('');
  };

  const handleSwitchTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    // Reset secondary states on tab switch
    setSelectedStyle(null);
    setSelectedArtist(null);
    setSearchQuery('');
  };

  return (
    <div className="relative min-h-screen pb-32">
      {/* Dynamic atmospheric background */}
      <BackgroundEffect />

      {/* --- TOP HEADER BAR --- */}
      <header className="sticky top-0 z-40 w-full bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-8 py-5 flex items-center justify-between select-none">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSwitchTab('discover')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-400 to-rose-400 flex items-center justify-center shadow-lg shadow-orange-500/10">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight text-white">Artis</span>
              <p className="text-[8px] font-mono text-gray-500 tracking-widest uppercase leading-none">
                ELEGANT STUDIO
              </p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <button 
              onClick={() => handleSwitchTab('discover')}
              className={`transition-colors ${activeTab === 'discover' ? 'text-white' : 'hover:text-white'}`}
            >
              Explore
            </button>
            <button 
              onClick={() => handleSwitchTab('studio')}
              className={`transition-colors ${activeTab === 'studio' ? 'text-white' : 'hover:text-white'}`}
            >
              Collections
            </button>
          </nav>
        </div>

        {/* Right side widgets matching Design HTML */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 font-mono text-xs text-gray-400 shadow-sm">
            <Clock size={12} className="opacity-60 text-gray-500" />
            <span>{timeString || '19:26'}</span>
          </div>

          <button 
            onClick={() => handleSwitchTab('studio')}
            className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors relative"
            title="查看我的收藏"
          >
            <Heart size={18} className={favorites.length > 0 ? "fill-red-500/20 text-red-400" : ""} />
            {favorites.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 shadow-md cursor-pointer" onClick={() => handleSwitchTab('studio')} />
        </div>
      </header>

      {/* --- MAIN PAGE LAYOUT WRAPPER --- */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        
        {/* TAB 1: DISCOVER / EXPLORE */}
        {activeTab === 'discover' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Ambient greeting */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#F5F5F7]">
                探索艺术的无尽疆域
              </h2>
              <p className="text-xs text-gray-500 font-mono tracking-wider uppercase">
                Discover Iconic Masterpieces / Filter & Annotate Custom Collections
              </p>
            </div>

            {/* Glassmorphic Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索画名、艺术家、流派或博物馆..."
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#0D0D0D] border border-white/5 text-sm text-[#F5F5F7] placeholder-gray-600 focus:outline-none focus:border-white/10 transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#F5F5F7]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Custom Sliding Filter Panels */}
            <div className="space-y-4 pt-2">
              {/* Category 1: Styles / 流派 */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Palette size={12} className="opacity-60 text-gray-500" />
                  Art Styles / 艺术流派
                </span>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x mask-gradient">
                  <button
                    onClick={() => setSelectedStyle(null)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all shrink-0 ${
                      selectedStyle === null
                        ? 'bg-[#F5F5F7] text-black font-bold shadow-md'
                        : 'bg-[#0D0D0D] hover:bg-[#121212] border border-white/5 text-gray-400'
                    }`}
                  >
                    全部流派
                  </button>
                  {ART_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style === selectedStyle ? null : style)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all shrink-0 ${
                        selectedStyle === style
                          ? 'bg-[#F5F5F7] text-black font-bold shadow-md border-none'
                          : 'bg-[#0D0D0D] hover:bg-[#121212] border border-white/5 text-gray-400'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category 2: Artists / 艺术家 */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen size={12} className="opacity-60 text-gray-500" />
                  Famous Artists / 艺术巨匠
                </span>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                  <button
                    onClick={() => setSelectedArtist(null)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all shrink-0 ${
                      selectedArtist === null
                        ? 'bg-[#F5F5F7] text-black font-bold shadow-md'
                        : 'bg-[#0D0D0D] hover:bg-[#121212] border border-white/5 text-gray-400'
                    }`}
                  >
                    全部艺术家
                  </button>
                  {ARTISTS.map((artist) => (
                    <button
                      key={artist}
                      onClick={() => setSelectedArtist(artist === selectedArtist ? null : artist)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all shrink-0 ${
                        selectedArtist === artist
                          ? 'bg-[#F5F5F7] text-black font-bold shadow-md border-none'
                          : 'bg-[#0D0D0D] hover:bg-[#121212] border border-white/5 text-gray-400'
                      }`}
                    >
                      {artist}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filtering Info Bar */}
            {(selectedStyle || selectedArtist || searchQuery) && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0D0D0D] border border-white/5 text-xs text-gray-400">
                <p>
                  当前筛选：
                  {selectedStyle && <span className="font-semibold text-orange-400 mr-2">{selectedStyle}</span>}
                  {selectedArtist && <span className="font-semibold text-rose-400 mr-2">{selectedArtist}</span>}
                  {searchQuery && <span className="italic text-[#F5F5F7] mr-2">"{searchQuery}"</span>}
                  (找到 {filteredPaintings.length} 幅作品)
                </p>
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors"
                >
                  <RefreshCw size={12} />
                  重置筛选
                </button>
              </div>
            )}

            {/* MAIN PORTFOLIO GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
              <AnimatePresence mode="popLayout">
                {filteredPaintings.map((painting) => (
                  <motion.div
                    key={painting.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PaintingCard
                      painting={painting}
                      isFavorited={favorites.includes(painting.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenDetails={setSelectedPainting}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty filter results screen */}
            {filteredPaintings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-16 rounded-[24px] bg-[#0D0D0D] border border-white/5 border-dashed"
              >
                <div className="w-12 h-12 rounded-full bg-[#050505] flex items-center justify-center mb-4 text-gray-500">
                  <Compass size={24} />
                </div>
                <h4 className="text-sm font-semibold text-[#F5F5F7] mb-1">未找到匹配的画作</h4>
                <p className="text-xs text-gray-500 mb-4 text-center">您可以换个搜索词或重置上方的流派和艺术家筛选。</p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold rounded-full bg-[#F5F5F7] text-black hover:bg-white transition-all duration-300"
                >
                  重置所有筛选
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* TAB 2: MY STUDIO / COLLECTION HUB */}
        {activeTab === 'studio' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Interactive Stats Dashboard and custom collection builder */}
            <Dashboard
              favoritePaintings={favoritePaintings}
              collections={collections}
              onCreateCollection={handleCreateSubmit => handleCreateCollection(handleCreateSubmit)}
              onDeleteCollection={handleDeleteCollection}
              onSelectCollection={setSelectedCollectionId}
              selectedCollectionId={selectedCollectionId}
              paintings={PAINTINGS}
            />

            {/* Divider line */}
            <div className="border-t border-white/5 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#F5F5F7] tracking-tight flex items-center gap-2">
                    <Heart size={16} className="text-rose-400 fill-current" />
                    {selectedCollectionId ? activeCollection?.name : '所有我的收藏 (All Favorites)'}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {selectedCollectionId 
                      ? `${activeCollection?.description || '专属分类空间'} · 包含 ${filteredPaintings.length} 幅作品`
                      : `你亲手标记的经典名作，共 ${filteredPaintings.length} 幅`}
                  </p>
                </div>

                {selectedCollectionId && (
                  <button
                    onClick={() => setSelectedCollectionId(null)}
                    className="text-xs text-gray-400 hover:text-white font-mono"
                  >
                    返回全部收藏
                  </button>
                )}
              </div>

              {/* Categorized works Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredPaintings.map((painting) => (
                    <motion.div
                      key={painting.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PaintingCard
                        painting={painting}
                        isFavorited={favorites.includes(painting.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onOpenDetails={setSelectedPainting}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Empty state for favorites / collections */}
              {filteredPaintings.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-16 rounded-[24px] bg-[#0D0D0D] border border-white/5 border-dashed"
                >
                  <Heart size={24} className="text-gray-600 mb-3" />
                  <h4 className="text-sm font-semibold text-[#F5F5F7] mb-1">
                    {selectedCollectionId ? '该美学分组内暂无作品' : '你的画作收纳盒是空的'}
                  </h4>
                  <p className="text-xs text-gray-500 mb-4 max-w-md text-center leading-relaxed">
                    {selectedCollectionId
                      ? '在“发现”标签页中找到对应的名作，打开详情页，将其勾选归属到该分组即可。'
                      : '浏览“发现”标签页，为您产生共鸣的大师之作点亮爱心，即可在这里随时观赏、编写私人随笔与贴标签。'}
                  </p>
                  <button
                    onClick={() => handleSwitchTab('discover')}
                    className="px-5 py-2.5 text-xs font-semibold rounded-full bg-[#F5F5F7] text-black hover:bg-white transition-all duration-300"
                  >
                    前往发现大师名画
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* --- ELEGANT DARK SYSTEM FOOTER --- */}
      <footer className="w-full border-t border-white/5 mt-16 px-8 py-5 flex flex-col sm:flex-row items-center justify-between bg-[#050505] text-[10px] text-gray-500 uppercase tracking-widest gap-4 select-none">
        <span className="flex items-center gap-1.5 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Last sync: Just now
        </span>
        <div className="flex items-center gap-6 font-mono">
          <span>{PAINTINGS.length} Items</span>
          <span>{ARTISTS.length} Artists</span>
          <span>{ART_STYLES.length} Styles</span>
        </div>
      </footer>

      {/* --- FLOATING BOTTOM NAVIGATION BAR CAPSULE --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-auto">
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#050505]/90 backdrop-blur-md shadow-[0_24px_48px_rgba(0,0,0,0.8)] border border-white/10">
          
          {/* Tab 1: Discover Button */}
          <button
            onClick={() => handleSwitchTab('discover')}
            className={`relative px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'discover'
                ? 'text-black z-10 font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {activeTab === 'discover' && (
              <motion.div
                layoutId="active-tab-indicator"
                transition={{ type: 'spring', duration: 0.5 }}
                className="absolute inset-0 bg-[#F5F5F7] rounded-full -z-10 shadow-md"
              />
            )}
            <Compass size={14} className={activeTab === 'discover' ? 'text-black' : 'text-gray-400'} />
            Explore (发现)
          </button>

          {/* Tab 2: Studio Button */}
          <button
            onClick={() => handleSwitchTab('studio')}
            className={`relative px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'studio'
                ? 'text-black z-10 font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {activeTab === 'studio' && (
              <motion.div
                layoutId="active-tab-indicator"
                transition={{ type: 'spring', duration: 0.5 }}
                className="absolute inset-0 bg-[#F5F5F7] rounded-full -z-10 shadow-md"
              />
            )}
            <Heart size={14} className={activeTab === 'studio' ? 'text-red-500 fill-current' : 'text-gray-400'} />
            Studio (我的)
          </button>
        </div>
      </nav>

      {/* --- IMMERSIVE OVERLAY CARD SHEET (DETAILS MODAL) --- */}
      <AnimatePresence>
        {selectedPainting && (
          <PaintingDetailSheet
            painting={selectedPainting}
            onClose={() => setSelectedPainting(null)}
            isFavorited={favorites.includes(selectedPainting.id)}
            onToggleFavorite={(id) => handleToggleFavorite(id)}
            savedNote={notes.find((n) => n.paintingId === selectedPainting.id) || null}
            onSaveNote={handleSaveNote}
            collections={collections}
            onToggleCollectionMembership={handleToggleCollectionMembership}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
