import { Category } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'gaming',
    name: 'Gaming',
    slug: 'gaming',
    iconName: 'Gamepad2',
    description: 'High-refresh displays, dedicated RTX graphics, and advanced vapor chamber thermals.',
  },
  {
    id: 'ultrabook',
    name: 'Ultrabook & Thin-Light',
    slug: 'ultrabook',
    iconName: 'Feather',
    description: 'Ultra-portable aluminum chassis with exceptional all-day battery life and vivid OLED screens.',
  },
  {
    id: 'creator',
    name: 'Creator & Studio',
    slug: 'creator',
    iconName: 'Palette',
    description: 'Color-accurate DCI-P3 displays, high RAM, and GPU acceleration for video editing and 3D modeling.',
  },
  {
    id: 'coding-ai',
    name: 'Coding & AI / ML',
    slug: 'coding-ai',
    iconName: 'Cpu',
    description: 'Multi-core computing power, expandable high-speed RAM, and NPU tensor cores for machine learning.',
  },
  {
    id: 'business',
    name: 'Business & Productivity',
    slug: 'business',
    iconName: 'Briefcase',
    description: 'Enterprise grade security, biometric logins, military-spec durability, and tactile keyboards.',
  },
  {
    id: 'budget-student',
    name: 'Student & Everyday',
    slug: 'budget-student',
    iconName: 'GraduationCap',
    description: 'Balanced performance, lightweight portability, and affordable price points for coursework.',
  },
];
