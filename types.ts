import { LucideIcon } from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  category: 'engineering' | 'media';
  description: string;
  imageUrl: string;
  tags: string[];
  link?: string;
}

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  type: 'engineering' | 'media';
}

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export enum Sender {
  User = 'user',
  Bot = 'model'
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
}

export type ChatStatus = 'chatting' | 'reviewing' | 'completed';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  status: ChatStatus;
}
