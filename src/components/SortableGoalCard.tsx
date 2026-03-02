import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GoalCard from './GoalCard';
import { DbGoal } from '@/hooks/useGoals';
import { GoalCategory } from '@/types/goal';
import { GripVertical } from 'lucide-react';

interface SortableGoalCardProps {
  goal: DbGoal;
  index: number;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onEdit: (id: string, data: { title: string; description: string; category: GoalCategory; targetDate: string; milestones: { id: string; title: string; completed: boolean }[] }) => void;
}

const SortableGoalCard = ({ goal, index, ...props }: SortableGoalCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/sortable">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover/sortable:opacity-60 hover:!opacity-100 cursor-grab active:cursor-grabbing transition-opacity p-1 text-muted-foreground"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <GoalCard goal={goal} index={index} {...props} />
    </div>
  );
};

export default SortableGoalCard;
