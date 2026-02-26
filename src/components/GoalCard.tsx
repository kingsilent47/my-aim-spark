import { motion } from 'framer-motion';
import { Goal, CATEGORY_CONFIG } from '@/types/goal';
import ProgressRing from './ProgressRing';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  index: number;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDelete: (id: string) => void;
}

const GoalCard = ({ goal, index, onToggleMilestone, onDelete }: GoalCardProps) => {
  const config = CATEGORY_CONFIG[goal.category];
  const isOverdue = isPast(parseISO(goal.targetDate)) && goal.progress < 100;
  const isComplete = goal.progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={`group relative rounded-lg border bg-card p-5 transition-shadow hover:shadow-md ${
        isComplete ? 'border-success/30' : isOverdue ? 'border-warning/30' : 'border-border'
      }`}
    >
      <div className="flex items-start gap-4">
        <ProgressRing progress={goal.progress} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{config.emoji}</span>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {config.label}
            </span>
            {isComplete && (
              <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                Complete ✓
              </span>
            )}
          </div>

          <h3 className="font-heading font-semibold text-lg text-card-foreground truncate">
            {goal.title}
          </h3>

          {goal.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {goal.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className={isOverdue ? 'text-warning font-medium' : ''}>
              {isOverdue ? 'Overdue · ' : ''}
              {format(parseISO(goal.targetDate), 'MMM d, yyyy')}
            </span>
          </div>

          {goal.milestones.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {goal.milestones.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-2 cursor-pointer group/item"
                >
                  <Checkbox
                    checked={m.completed}
                    onCheckedChange={() => onToggleMilestone(goal.id, m.id)}
                    className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                  />
                  <span
                    className={`text-sm transition-colors ${
                      m.completed
                        ? 'line-through text-muted-foreground'
                        : 'text-card-foreground'
                    }`}
                  >
                    {m.title}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
          onClick={() => onDelete(goal.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default GoalCard;
