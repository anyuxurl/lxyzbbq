import React, { useState } from 'react';
import { Post } from '../types';
import { CATEGORY_CONFIG } from '../constants';
import { Heart, MessageSquare } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onClick: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const config = CATEGORY_CONFIG[post.category];
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      onLike(post.id);
      setIsLiked(true);
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  };

  return (
    <div 
      onClick={() => onClick(post)}
      className={`
        group relative overflow-hidden rounded-2xl p-6 shadow-sm transition-all duration-300 
        hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-white/50
        bg-gradient-to-br ${post.colorTheme}
      `}
    >
      {/* Category Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className={`
          flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/70 backdrop-blur-sm shadow-sm
          ${config.text}
        `}>
          {config.icon}
          <span>{config.label}</span>
        </div>
        <span className="text-xs text-slate-500/90 font-medium bg-white/30 px-2 py-0.5 rounded-md">
          {formatTime(post.timestamp)}
        </span>
      </div>

      {/* Content */}
      <p className="text-slate-800 text-[17px] leading-relaxed mb-6 font-medium line-clamp-4 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between mt-auto">
        <div className="text-sm font-bold text-slate-600/90 flex items-center gap-1">
           <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
           {post.authorAlias || '匿名同学'}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLike}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200
              ${isLiked 
                ? 'text-red-500 bg-red-50 shadow-inner' 
                : 'text-slate-500 hover:bg-white/60 active:bg-white/80'}
            `}
          >
            <Heart className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-bold tabular-nums">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          
          <div className="flex items-center gap-1 text-slate-500 px-3 py-1.5 rounded-full hover:bg-white/60 transition-colors">
            <MessageSquare className="w-4.5 h-4.5" />
            <span className="text-sm font-bold tabular-nums">{post.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;