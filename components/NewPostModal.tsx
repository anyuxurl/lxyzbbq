import React, { useState } from 'react';
import { Category } from '../types';
import { CATEGORY_CONFIG } from '../constants';
import { X, Sparkles, Send, Loader2, AlertTriangle } from 'lucide-react';
import { polishTextWithAI } from '../services/geminiService';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, category: Category, alias: string) => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.CONFESSION);
  const [alias, setAlias] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);

  if (!isOpen) return null;

  const handlePolish = async () => {
    if (!content.trim()) return;
    
    setIsPolishing(true);
    let style: 'romantic' | 'funny' | 'formal' = 'formal';
    
    if (selectedCategory === Category.CONFESSION) style = 'romantic';
    if (selectedCategory === Category.FUNNY) style = 'funny';
    
    const polished = await polishTextWithAI(content, style);
    setContent(polished);
    setIsPolishing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content, selectedCategory, alias || '神秘路人');
    setContent('');
    setAlias('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8 transform transition-all scale-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">发布新动态</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">选择板块</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(Category).map((cat) => {
                const config = CATEGORY_CONFIG[cat];
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${isSelected 
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                  >
                    {config.icon}
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">内容</label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="这一刻的想法..."
                className="w-full h-32 p-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none transition-all"
              />
              {/* AI Button */}
              <button
                type="button"
                onClick={handlePolish}
                disabled={isPolishing || !content.trim()}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {isPolishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI 润色
              </button>
            </div>
          </div>

          {/* Alias Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">署名 (可选)</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="例如: 某不知名学长"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Disclaimer text */}
          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-lg">
             <AlertTriangle className="w-4 h-4 shrink-0" />
             <p>注意：本系统仅供演示，请勿发布任何真实个人信息或敏感内容，发布的内容仅存储在本地。</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!content.trim()}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            发布上墙
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPostModal;