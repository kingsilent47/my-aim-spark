import { useState, useCallback } from 'react';
import { Goal, GoalCategory, Milestone } from '@/types/goal';

const STORAGE_KEY = 'goaltracker-goals';

const loadGoals = (): Goal[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveGoals = (goals: Goal[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
};

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(loadGoals);

  const updateGoals = useCallback((updater: (prev: Goal[]) => Goal[]) => {
    setGoals((prev) => {
      const next = updater(prev);
      saveGoals(next);
      return next;
    });
  }, []);

  const addGoal = useCallback((data: { title: string; description: string; category: GoalCategory; targetDate: string; milestones: string[] }) => {
    const goal: Goal = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      category: data.category,
      progress: 0,
      targetDate: data.targetDate,
      createdAt: new Date().toISOString(),
      milestones: data.milestones.filter(Boolean).map((title) => ({
        id: crypto.randomUUID(),
        title,
        completed: false,
      })),
    };
    updateGoals((prev) => [goal, ...prev]);
  }, [updateGoals]);

  const deleteGoal = useCallback((id: string) => {
    updateGoals((prev) => prev.filter((g) => g.id !== id));
  }, [updateGoals]);

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    updateGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completed = milestones.filter((m) => m.completed).length;
        const progress = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : g.progress;
        return { ...g, milestones, progress };
      })
    );
  }, [updateGoals]);

  const updateProgress = useCallback((goalId: string, progress: number) => {
    updateGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, progress: Math.min(100, Math.max(0, progress)) } : g))
    );
  }, [updateGoals]);

  return { goals, addGoal, deleteGoal, toggleMilestone, updateProgress };
}
