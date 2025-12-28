import React, { useState, useEffect } from 'react';
import { Category, Post, Comment } from './types';
import { CATEGORY_CONFIG, MOCK_POSTS } from './constants';
import PostCard from './components/PostCard';
import NewPostModal from './components/NewPostModal';
import PostDetailModal from './components/PostDetailModal';
import { Plus, LayoutGrid, Heart, Menu, X, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New States for Detail View and Mobile Menu
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const saved = localStorage.getItem('uniheart_posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      setPosts(MOCK_POSTS as unknown as Post[]);
    }
  }, []);

  // Persistence
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('uniheart_posts', JSON.stringify(posts));
    }
  }, [posts]);

  // Create Post
  const handleCreatePost = (content: string, category: Category, authorAlias: string) => {
    const themes = [
      'from-pink-50 to-rose-50', 
      'from-blue-50 to-indigo-50', 
      'from-amber-50 to-orange-50', 
      'from-emerald-50 to-teal-50', 
      'from-violet-50 to-purple-50'
    ];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    const newPost: Post = {
      id: Date.now().toString(),
      content,
      category,
      authorAlias,
      timestamp: Date.now(),
      likes: 0,
      comments: [],
      colorTheme: randomTheme
    };

    setPosts([newPost, ...posts]);
  };

  // Like Post
  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  // Add Comment
  const handleAddComment = (postId: string, content: string, alias: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      authorAlias: alias,
      timestamp: Date.now()
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    }));
  };

  const filteredPosts = activeCategory === 'ALL' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  const selectedPost = posts.find(p => p.id === selectedPostId) || null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="
        hidden md:flex
        md:w-64 md:h-screen md:fixed md:top-0 md:left-0 md:border-r md:border-gray-200 
        bg-white z-20 shadow-none flex-col
      ">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-800 tracking-tight leading-none">礼县一中</h1>
            <span className="text-xs font-medium text-slate-400">校园表白墙</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`
              w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all
              ${activeCategory === 'ALL' 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'}
            `}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="font-bold">全部动态</span>
          </button>

          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key as Category)}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all
                ${activeCategory === key 
                  ? `${config.bg} ${config.text} border-transparent shadow-sm` 
                  : 'text-slate-600 hover:bg-slate-100'}
              `}
            >
              {config.icon}
              <span className="font-bold">{config.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-6">
          <div className="text-xs text-slate-400 text-center leading-relaxed">
             &copy; 2024 Lixian No.1<br/>High School
          </div>
        </div>
      </aside>

      {/* ============ MOBILE HEADER (Replaces Slider) ============ */}
      <div className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center gap-2" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">礼县一中表白墙</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all
                ${isMobileMenuOpen 
                  ? 'bg-slate-100 text-slate-800' 
                  : 'bg-white border border-gray-200 text-slate-600'}
              `}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>分类</span>
            </button>
          </div>
        </div>

        {/* Mobile Category Grid (Collapsible) */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setActiveCategory('ALL'); setIsMobileMenuOpen(false); }}
                className={`
                  flex items-center gap-2 p-3 rounded-xl border transition-all
                  ${activeCategory === 'ALL' 
                    ? 'bg-slate-800 text-white border-slate-800' 
                    : 'bg-white text-slate-600 border-gray-100 hover:bg-gray-50'}
                `}
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="font-bold">全部动态</span>
              </button>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => { setActiveCategory(key as Category); setIsMobileMenuOpen(false); }}
                  className={`
                    flex items-center gap-2 p-3 rounded-xl border transition-all
                    ${activeCategory === key 
                      ? `${config.bg} ${config.text} border-current` 
                      : 'bg-white text-slate-600 border-gray-100 hover:bg-gray-50'}
                  `}
                >
                  {config.icon}
                  <span className="font-bold">{config.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 min-h-[calc(100vh-64px)] md:min-h-screen flex flex-col">
        
        {/* DEMO DISCLAIMER BANNER */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start md:items-center gap-3 text-amber-900 shadow-sm">
           <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5 md:mt-0" />
           <div className="text-sm font-medium">
             <span className="font-bold">温馨提示：</span>
             本页面仅供演示，并未实际运营。所有内容均为测试数据，请勿发布真实个人隐私信息。
           </div>
        </div>

        {/* Desktop Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {activeCategory === 'ALL' ? '最新动态' : CATEGORY_CONFIG[activeCategory].label}
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              {activeCategory === 'ALL' 
                ? '在这里发现礼县一中的新鲜事...' 
                : `正在浏览 ${CATEGORY_CONFIG[activeCategory].label} 板块`}
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30 transition-all active:scale-95 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            发布动态
          </button>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
          {filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={handleLike} 
              onClick={(p) => setSelectedPostId(p.id)}
            />
          ))}
          {filteredPosts.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LayoutGrid className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-600">这里空空如也</h3>
              <p className="text-slate-400">快来发布第一条内容吧！</p>
            </div>
          )}
        </div>

        {/* Mobile Footer */}
        <div className="md:hidden mt-8 pt-8 pb-24 border-t border-slate-200/60 text-center">
            <p className="text-xs font-bold text-slate-400">© 2024 礼县一中表白墙</p>
            <p className="text-[10px] text-slate-300 mt-1">Designed by qeeryyu</p>
        </div>
      </main>

      {/* Mobile FAB */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-600 text-white rounded-full shadow-2xl shadow-brand-500/40 flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Create Modal */}
      <NewPostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreatePost} 
      />

      {/* Detail Modal */}
      {selectedPost && (
        <PostDetailModal 
          post={selectedPost}
          onClose={() => setSelectedPostId(null)}
          onAddComment={handleAddComment}
          onLike={handleLike}
        />
      )}
    </div>
  );
};

export default App;