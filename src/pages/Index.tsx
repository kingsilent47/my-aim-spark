import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGoals } from '@/hooks/useGoals';
import { GoalCategory, CATEGORY_CONFIG } from '@/types/goal';
import GoalCard from '@/components/GoalCard';
import AddGoalDialog from '@/components/AddGoalDialog';
import StatsBar from '@/components/StatsBar';
import EmptyState from '@/components/EmptyState';
import { Target } from 'lucide-react';

const allCategories = Object.keys(CATEGORY_CONFIG) as GoalCategory[];

const Index = () => {
  const { goals, addGoal, deleteGoal, toggleMilestone } = useGoals();
  const [filter, setFilter] = useState<GoalCategory | 'all'>('all');

  const filtered = filter === 'all' ? goals : goals.filter((g) => g.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                GoalTracker
              </h1>
              <p className="text-sm text-muted-foreground">Stay focused, stay on track</p>
            </div>
          </div>
          <AddGoalDialog onAdd={addGoal} />
        </motion.div>

        {/* Stats */}
        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <StatsBar goals={goals} />
          </motion.div>
        )}

        {/* Filters */}
        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
              }`}
            >
              All
            </button>
            {allCategories.map((key) => {
              const config = CATEGORY_CONFIG[key];
              const count = goals.filter((g) => g.category === key).length;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    filter === key
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
                  }`}
                >
                  {config.emoji} {config.label} ({count})
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Goals List */}
        {filtered.length === 0 && goals.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No goals in this category yet.</p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((goal, i) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={i}
                  onToggleMilestone={toggleMilestone}
                  onDelete={deleteGoal}
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
