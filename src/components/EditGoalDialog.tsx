import { useState, useEffect } from 'react';
import { GoalCategory, CATEGORY_CONFIG } from '@/types/goal';
import { DbGoal } from '@/hooks/useGoals';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface EditGoalDialogProps {
  goal: DbGoal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, data: {
    title: string;
    description: string;
    category: GoalCategory;
    targetDate: string;
    milestones: { id: string; title: string; completed: boolean }[];
  }) => void;
}

const categories = Object.entries(CATEGORY_CONFIG) as [GoalCategory, { label: string; emoji: string }][];

const EditGoalDialog = ({ goal, open, onOpenChange, onSave }: EditGoalDialogProps) => {
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description || '');
  const [category, setCategory] = useState<GoalCategory>(goal.category as GoalCategory);
  const [targetDate, setTargetDate] = useState(goal.target_date);
  const [milestones, setMilestones] = useState(goal.milestones.map(m => ({ ...m })));

  useEffect(() => {
    if (open) {
      setTitle(goal.title);
      setDescription(goal.description || '');
      setCategory(goal.category as GoalCategory);
      setTargetDate(goal.target_date);
      setMilestones(goal.milestones.map(m => ({ ...m })));
    }
  }, [open, goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;
    onSave(goal.id, {
      title: title.trim(),
      description: description.trim(),
      category,
      targetDate,
      milestones,
    });
    onOpenChange(false);
  };

  const updateMilestoneTitle = (index: number, value: string) => {
    const next = [...milestones];
    next[index] = { ...next[index], title: value };
    setMilestones(next);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    setMilestones([...milestones, { id: crypto.randomUUID(), title: '', completed: false }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Edit Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="edit-title">Goal Title</Label>
            <Input id="edit-title" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea id="edit-desc" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          </div>
          <div>
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {categories.map(([key, config]) => (
                <button key={key} type="button" onClick={() => setCategory(key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    category === key
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
                  }`}
                >{config.emoji} {config.label}</button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="edit-date">Target Date</Label>
            <Input id="edit-date" type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} required />
          </div>
          <div>
            <Label>Milestones</Label>
            <div className="space-y-2 mt-1.5">
              {milestones.map((m, i) => (
                <div key={m.id} className="flex gap-2">
                  <Input value={m.title} onChange={e => updateMilestoneTitle(i, e.target.value)} placeholder={`Milestone ${i + 1}`} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeMilestone(i)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addMilestone} className="text-xs">+ Add milestone</Button>
            </div>
          </div>
          <Button type="submit" className="w-full font-heading">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGoalDialog;
