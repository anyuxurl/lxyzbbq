import { Category } from './types';
import React from 'react';
import { Heart, Lock, HelpCircle, Search, Smile } from 'lucide-react';

export const CATEGORY_CONFIG: Record<Category, { label: string; icon: React.ReactNode; color: string; bg: string; text: string }> = {
  [Category.CONFESSION]: {
    label: '表白墙',
    icon: <Heart className="w-4 h-4" />,
    color: 'text-rose-500',
    bg: 'bg-rose-50 border-rose-100',
    text: 'text-rose-700'
  },
  [Category.SECRET]: {
    label: '树洞秘密',
    icon: <Lock className="w-4 h-4" />,
    color: 'text-purple-500',
    bg: 'bg-purple-50 border-purple-100',
    text: 'text-purple-700'
  },
  [Category.HELP]: {
    label: '万能求助',
    icon: <HelpCircle className="w-4 h-4" />,
    color: 'text-blue-500',
    bg: 'bg-blue-50 border-blue-100',
    text: 'text-blue-700'
  },
  [Category.LOST_FOUND]: {
    label: '失物招领',
    icon: <Search className="w-4 h-4" />,
    color: 'text-amber-500',
    bg: 'bg-amber-50 border-amber-100',
    text: 'text-amber-700'
  },
  [Category.FUNNY]: {
    label: '校园趣事',
    icon: <Smile className="w-4 h-4" />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 border-emerald-100',
    text: 'text-emerald-700'
  }
};

export const MOCK_POSTS = [
  {
    id: '1',
    content: '高二（4）班那个嘉豪同学，每次课间都能看到你，真的好帅！希望能认识一下！',
    category: Category.CONFESSION,
    timestamp: Date.now() - 3600000,
    likes: 32,
    authorAlias: '高一学妹',
    colorTheme: 'from-pink-100 to-rose-50',
    comments: [
      { id: 'c1', content: '是不是戴眼镜那个？', authorAlias: '路人甲', timestamp: Date.now() - 1800000 },
      { id: 'c2', content: '帮顶！祝成功！！！', authorAlias: '吃瓜群众', timestamp: Date.now() - 900000 }
    ]
  },
  {
    id: '2',
    content: '谁在操场主席台旁边捡到了我的校园卡？名字叫李明，请联系我，必有重谢！😭',
    category: Category.LOST_FOUND,
    timestamp: Date.now() - 7200000,
    likes: 8,
    authorAlias: '丢三落四',
    colorTheme: 'from-amber-100 to-orange-50',
    comments: []
  },
  {
    id: '3',
    content: '下周的数学月考大家复习得怎么样了？立体几何真的太难了，求学霸指点迷津！',
    category: Category.HELP,
    timestamp: Date.now() - 12000000,
    likes: 15,
    authorAlias: '数学苦手',
    colorTheme: 'from-blue-100 to-cyan-50',
    comments: [
      { id: 'c3', content: '多刷题，尤其是历年真题', authorAlias: '数学课代表', timestamp: Date.now() - 6000000 }
    ]
  }
];