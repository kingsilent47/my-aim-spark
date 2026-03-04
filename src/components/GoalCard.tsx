import { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORY_CONFIG, GoalCategory } from '@/types/goal';
import { DbGoal } from '@/hooks/useGoals';
import ProgressRing from './ProgressRing';
import EditGoalDialog from './EditGoalDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar, Pin, Archive, RotateCcw, Pencil } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';

interface GoalCardProps {
  goal: DbGoal;
  index: number;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onEdit: (id: string, data: { title: string; description: string; category: GoalCategory; targetDate: string; milestones: { id: string; title: string; completed: boolean }[] }) => void;
}

const GoalCard = ({ goal, index, onToggleMilestone, onDelete, onTogglePin, onUpdateStatus, onEdit }: GoalCardProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const config = CATEGORY_CONFIG[goal.category as keyof typeof CATEGORY_CONFIG] || { label: goal.category, emoji: '🎯' };
  const isOverdue = isPast(parseISO(goal.target_date)) && goal.progress < 100;
  const isComplete = goal.progress === 100 || goal.status === 'completed';
  const isArchived = goal.status === 'archived';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative rounded-lg border bg-card p-6 card-premium ${
        isComplete ? 'border-success/30' : isOverdue ? 'border-warning/30' : isArchived ? 'border-border opacity-60' : 'border-border'
      }`}
    >
      {/* Subtle gradient overlay for completed goals */}
      {isComplete && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-success/5 to-transparent pointer-events-none" />
      )}

      {goal.pinned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full p-1.5 shadow-soft"
        >
          <Pin className="w-3 h-3" />
        </motion.div>
      )}

      <div className="flex items-start gap-5">
        <ProgressRing progress={goal.progress} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">{config.emoji}</span>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{config.label}</span>
            {isComplete && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs font-medium text-success bg-success/10 px-2.5 py-0.5 rounded-full"
              >
                Complete ✓
              </motion.span>
            )}
            {isArchived && <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">Archived</span>}
          </div>
          <h3 className="font-heading font-semibold text-lg text-card-foreground truncate">{goal.title}</h3>
          {goal.description && <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{goal.description}</p>}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className={isOverdue ? 'text-warning font-medium' : ''}>
              {isOverdue ? 'Overdue · ' : ''}{format(parseISO(goal.target_date), 'MMM d, yyyy')}
            </span>
          </div>
          {goal.milestones.length > 0 && (
            <div className="mt-4 space-y-2 checkbox-smooth">
              {goal.milestones.map((m) => (
                <label key={m.id} className="flex items-center gap-2.5 cursor-pointer group/ms">
                  <Checkbox
                    checked={m.completed}
                    onCheckedChange={() => onToggleMilestone(goal.id, m.id)}
                    className="data-[state=checked]:bg-success data-[state=checked]:border-success transition-all duration-200"
                    disabled={isArchived}
                  />
                  <span className={`text-sm transition-all duration-300 ${m.completed ? 'line-through text-muted-foreground' : 'text-card-foreground group-hover/ms:text-foreground'}`}>
                    {m.title}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0">
          {!isArchived && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary btn-press" onClick={() => setEditOpen(true)} title="Edit">
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent btn-press" onClick={() => onTogglePin(goal.id)} title={goal.pinned ? 'Unpin' : 'Pin'}>
            <Pin className={`w-3.5 h-3.5 transition-transform duration-200 ${goal.pinned ? 'fill-current rotate-45' : ''}`} />
          </Button>
          {isArchived ? (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary btn-press" onClick={() => onUpdateStatus(goal.id, 'active')} title="Restore">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-muted-foreground btn-press" onClick={() => onUpdateStatus(goal.id, 'archived')} title="Archive">
              <Archive className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive btn-press" onClick={() => onDelete(goal.id)} title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <EditGoalDialog goal={goal} open={editOpen} onOpenChange={setEditOpen} onSave={onEdit} />
    </motion.div>
  );
};

export default GoalCard;
