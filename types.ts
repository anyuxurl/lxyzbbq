export enum Category {
  CONFESSION = 'CONFESSION',
  SECRET = 'SECRET',
  HELP = 'HELP',
  LOST_FOUND = 'LOST_FOUND',
  FUNNY = 'FUNNY'
}

export interface Post {
  id: string;
  content: string;
  category: Category;
  timestamp: number;
  likes: number;
  authorAlias?: string; // e.g., "Anonymous Squirrel"
  colorTheme: string; // CSS class for background
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  timestamp: number;
  authorAlias: string;
}

export interface CreatePostPayload {
  content: string;
  category: Category;
  authorAlias: string;
}
