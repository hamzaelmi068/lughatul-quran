export interface User {
  id: string;
  email?: string;
}

export interface Word {
  id: string;
  arabic: string;
  root: string;
  english: string;
  ayah: string;
  surah: string;
  ayahNumber: number;
  audioUrl?: string;
}

export interface UserWord {
  id: string;
  userId: string;
  wordId: string;
  status: 'not_started' | 'learning' | 'mastered';
  notes?: string;
  lastReviewed?: Date;
  nextReviewDate?: Date;
}

export interface Flashcard {
  id: string;
  userId: string;
  wordId: string;
  easeFactor: number;
  interval: number;
  createdAt: Date;
}