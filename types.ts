import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface Game {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  component: React.ReactNode;
  description: string;
  isPremium?: boolean;
  price?: number;
}

export type ThemeColor = 'red' | 'blue' | 'yellow' | 'green' | 'gray';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or icon name
  unlockedAt?: number;
}
