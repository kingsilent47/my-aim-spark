import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGoals } from '@/hooks/useGoals';
import { useAuth } from '@/hooks/useAuth';
import { GoalCategory, CATEGORY_CONFIG } from '@/types/goal';
import GoalCard from '@/components/GoalCard';
import AddGoalDialog from '@/components/AddGoalDialog';
import StatsBar from '@/components/StatsBar';
import EmptyState from '@/components/EmptyState';
import ThemeToggle from '@/components/ThemeToggle';
import AnalyticsModal from '@/components/AnalyticsModal';
import StreakCalendar from '@/components/StreakCalendar';
import { Target, LogOut, Download, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigate } from 'react-router-dom';

type StatusFilter = 'all' | 'pinned' | 'active' | 'completed' | 'archived';
const allCategories = Object.keys(CATEGORY_CONFIG) as GoalCategory[];

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { goals, loading, addGoal, updateGoal, deleteGoal, toggleMilestone, updateGoalStatus, togglePin, exportGoals } = useGoals();
  const [categoryFilter, setCategoryFilter] = useState<GoalCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = goals;
    if (statusFilter === 'pinned') result = result.filter(g => g.pinned);
    else if (statusFilter !== 'all') result = result.filter(g => g.status === statusFilter);
    if (categoryFilter !== 'all') result = result.filter(g => g.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(g => g.title.toLowerCase().includes(q) || (g.description || '').toLowerCase().includes(q));
    }
    return result;
  }, [goals, statusFilter, categoryFilter, search]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pinned', label: '📌 Pinned' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'archived', label: 'Archived' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2"><Target className="w-6 h-6 text-primary" /></div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">GoalTracker</h1>
              <p className="text-sm text-muted-foreground">Stay focused, stay on track</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <AnalyticsModal goals={goals} />
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={exportGoals} className="text-muted-foreground" title="Export JSON">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} className="text-muted-foreground" title="Sign out">
              <LogOut className="w-4 h-4" />
            </Button>
            <AddGoalDialog onAdd={addGoal} />
          </div>
        </motion.div>

        {/* Streak Calendar */}
        {goals.length > 0 && (
          <div className="mb-6">
            <StreakCalendar />
          </div>
        )}

        {/* Stats */}
        {goals.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
            <StatsBar goals={goals} />
          </motion.div>
        )}

        {/* Search */}
        {goals.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search goals..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
          </motion.div>
        )}

        {/* Status Filters */}
        {goals.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }} className="flex flex-wrap gap-2 mb-4">
            {statusFilters.map(sf => (
              <button key={sf.key} onClick={() => setStatusFilter(sf.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  statusFilter === sf.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
                }`}
              >{sf.label}</button>
            ))}
          </motion.div>
        )}

        {/* Category Filters */}
        {goals.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }} className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                categoryFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
              }`}
            >All Categories</button>
            {allCategories.map(key => {
              const config = CATEGORY_CONFIG[key];
              const count = goals.filter(g => g.category === key).length;
              if (count === 0) return null;
              return (
                <button key={key} onClick={() => setCategoryFilter(key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    categoryFilter === key ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
                  }`}
                >{config.emoji} {config.label} ({count})</button>
              );
            })}
          </motion.div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 && goals.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No goals match your filters.</p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((goal, i) => (
                <GoalCard key={goal.id} goal={goal} index={i}
                  onToggleMilestone={toggleMilestone} onDelete={deleteGoal}
                  onTogglePin={togglePin} onUpdateStatus={updateGoalStatus}
                  onEdit={updateGoal}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
