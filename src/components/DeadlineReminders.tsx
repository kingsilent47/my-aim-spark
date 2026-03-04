import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DbGoal } from '@/hooks/useGoals';
import { differenceInDays, parseISO } from 'date-fns';
import { AlertTriangle, Clock, X } from 'lucide-react';

interface DeadlineRemindersProps {
  goals: DbGoal[];
}

const DeadlineReminders = ({ goals }: DeadlineRemindersProps) => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const upcoming = useMemo(() => {
    const now = new Date();
    return goals
      .filter(g => g.status === 'active' && g.progress < 100 && !dismissed.has(g.id))
      .map(g => {
        const days = differenceInDays(parseISO(g.target_date), now);
        return { ...g, daysLeft: days };
      })
      .filter(g => g.daysLeft <= 3 && g.daysLeft >= -7)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [goals, dismissed]);

  if (upcoming.length === 0) return null;

  return (
    <div className="space-y-2.5 mb-8">
      <AnimatePresence>
        {upcoming.map(g => {
          const isOverdue = g.daysLeft < 0;
          const isUrgent = g.daysLeft <= 1;
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm shadow-soft ${
                isOverdue
                  ? 'bg-destructive/8 border-destructive/20 text-destructive'
                  : isUrgent
                  ? 'bg-warning/8 border-warning/20 text-warning'
                  : 'bg-accent/5 border-border text-foreground'
              }`}
            >
              {isOverdue ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 shrink-0" />
              )}
              <span className="flex-1 min-w-0 truncate">
                <span className="font-medium">{g.title}</span>
                {' — '}
                {isOverdue
                  ? `Overdue by ${Math.abs(g.daysLeft)} day${Math.abs(g.daysLeft) !== 1 ? 's' : ''}`
                  : g.daysLeft === 0
                  ? 'Due today!'
                  : g.daysLeft === 1
                  ? 'Due tomorrow'
                  : `Due in ${g.daysLeft} days`}
                {' '}
                <span className="text-muted-foreground">({g.progress}% done)</span>
              </span>
              <button
                onClick={() => setDismissed(prev => new Set(prev).add(g.id))}
                className="shrink-0 p-1 rounded-md hover:bg-background/50 transition-colors btn-press"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default DeadlineReminders;
