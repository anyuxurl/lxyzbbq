import React, { useState } from 'react';
import { Post, Comment } from '../types';
import { CATEGORY_CONFIG } from '../constants';
import { X, Heart, MessageSquare, Send, User } from 'lucide-react';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  onAddComment: (postId: string, content: string, alias: string) => void;
  onLike: (postId: string) => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose, onAddComment, onLike }) => {
  const [commentContent, setCommentContent] = useState('');
  const [commentAlias, setCommentAlias] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  if (!post) return null;

  const config = CATEGORY_CONFIG[post.category];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    onAddComment(post.id, commentContent, commentAlias || '围观同学');
    setCommentContent('');
    setCommentAlias('');
  };

  const handleLike = () => {
    if (!isLiked) {
      onLike(post.id);
      setIsLiked(true);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content - Full screen on mobile, bounded on desktop */}
      <div className="relative w-full md:max-w-2xl h-full md:h-[85vh] bg-white md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${config.bg} ${config.text}`}>
              {config.icon}
            </div>
            <span className="font-bold text-gray-800">{config.label}详情</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50/50">
          {/* Main Post Section */}
          <div className={`p-6 md:p-8 bg-gradient-to-b ${post.colorTheme}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-gray-600 shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-gray-800">{post.authorAlias || '匿名同学'}</div>
                <div className="text-xs text-gray-500">{formatTime(post.timestamp)}</div>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
              {post.content}
            </p>

            <div className="flex items-center gap-4 mt-8">
              <button 
                onClick={handleLike}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all
                  ${isLiked 
                    ? 'bg-red-50 text-red-500 shadow-inner' 
                    : 'bg-white/60 text-gray-600 hover:bg-white hover:scale-[1.02] shadow-sm'}
                `}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                {post.likes + (isLiked ? 1 : 0)} 赞
              </button>
              <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-white/60 text-gray-600 shadow-sm">
                <MessageSquare className="w-5 h-5" />
                {post.comments.length} 评论
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="p-4 md:p-6 bg-white rounded-t-3xl -mt-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] min-h-[300px]">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              全部评论 <span className="text-sm font-normal text-gray-400">({post.comments.length})</span>
            </h3>

            <div className="space-y-6">
              {post.comments.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p>还没有人评论，快来抢沙发！</p>
                </div>
              ) : (
                post.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-xs font-bold text-gray-500">{comment.authorAlias[0]}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-sm font-bold text-gray-700">{comment.authorAlias}</span>
                        <span className="text-xs text-gray-400">{formatTime(comment.timestamp)}</span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed bg-gray-50 p-3 rounded-r-xl rounded-bl-xl">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Spacer for input area */}
            <div className="h-24"></div>
          </div>
        </div>

        {/* Fixed Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-white border-t border-gray-100 z-20">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
             <div className="flex-1 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
                <input
                  type="text"
                  value={commentAlias}
                  onChange={(e) => setCommentAlias(e.target.value)}
                  placeholder="昵称 (可选)"
                  className="w-full text-xs font-bold text-gray-600 bg-transparent border-b border-gray-200 pb-1 mb-1 px-1 focus:outline-none"
                />
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="写下你的评论..."
                  rows={1}
                  className="w-full bg-transparent px-1 text-sm focus:outline-none resize-none max-h-24"
                  style={{ minHeight: '24px' }}
                />
             </div>
             <button 
               type="submit"
               disabled={!commentContent.trim()}
               className="p-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center"
             >
               <Send className="w-5 h-5" />
             </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default PostDetailModal;