export type GoalCategory = 'health' | 'career' | 'personal' | 'finance' | 'learning';

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  progress: number; // 0-100
  targetDate: string;
  createdAt: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export const CATEGORY_CONFIG: Record<GoalCategory, { label: string; emoji: string }> = {
  health: { label: 'Health', emoji: '💪' },
  career: { label: 'Career', emoji: '🚀' },
  personal: { label: 'Personal', emoji: '🌱' },
  finance: { label: 'Finance', emoji: '💰' },
  learning: { label: 'Learning', emoji: '📚' },
};
