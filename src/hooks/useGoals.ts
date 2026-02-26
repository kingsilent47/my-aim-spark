import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { GoalCategory, Milestone } from '@/types/goal';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface DbGoal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  progress: number;
  target_date: string;
  milestones: Milestone[];
  status: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<DbGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const undoRef = useRef<{ goal: DbGoal; action: 'delete' } | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!user) { setGoals([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) { toast.error('Failed to load goals'); console.error(error); }
    else {
      setGoals((data || []).map(g => ({
        ...g,
        milestones: (Array.isArray(g.milestones) ? g.milestones : []) as unknown as Milestone[],
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const addGoal = useCallback(async (data: {
    title: string; description: string; category: GoalCategory; targetDate: string; milestones: string[];
  }) => {
    if (!user) return;
    const milestones: Milestone[] = data.milestones.filter(Boolean).map(t => ({
      id: crypto.randomUUID(), title: t, completed: false,
    }));
    const { error } = await supabase.from('goals').insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      target_date: data.targetDate,
      milestones: milestones as unknown as Json,
    });
    if (error) toast.error('Failed to create goal');
    else { toast.success('Goal created!'); fetchGoals(); }
  }, [user, fetchGoals]);

  const deleteGoal = useCallback(async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    undoRef.current = { goal, action: 'delete' };
    setGoals(prev => prev.filter(g => g.id !== id));
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); fetchGoals(); return; }
    toast('Goal deleted', {
      action: { label: 'Undo', onClick: () => undoDelete() },
    });
  }, [goals, fetchGoals]);

  const undoDelete = useCallback(async () => {
    const item = undoRef.current;
    if (!item) return;
    const { id, user_id, title, description, category, progress, target_date, milestones, status, pinned } = item.goal;
    await supabase.from('goals').insert({
      id, user_id, title, description, category, progress, target_date,
      milestones: milestones as unknown as Json, status, pinned,
    });
    undoRef.current = null;
    fetchGoals();
  }, [fetchGoals]);

  const toggleMilestone = useCallback(async (goalId: string, milestoneId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const milestones = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completed = milestones.filter(m => m.completed).length;
    const progress = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : goal.progress;
    const status = progress === 100 ? 'completed' : 'active';

    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, milestones, progress, status } : g));
    await supabase.from('goals').update({
      milestones: milestones as unknown as Json, progress, status,
    }).eq('id', goalId);
  }, [goals]);

  const updateGoalStatus = useCallback(async (goalId: string, status: string) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status } : g));
    await supabase.from('goals').update({ status }).eq('id', goalId);
  }, []);

  const togglePin = useCallback(async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const pinned = !goal.pinned;
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, pinned } : g));
    await supabase.from('goals').update({ pinned }).eq('id', goalId);
  }, [goals]);

  const exportGoals = useCallback(() => {
    const blob = new Blob([JSON.stringify(goals, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `goals-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
    toast.success('Goals exported!');
  }, [goals]);

  return { goals, loading, addGoal, deleteGoal, toggleMilestone, updateGoalStatus, togglePin, exportGoals, refetch: fetchGoals };
}
