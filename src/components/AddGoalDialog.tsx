import { useState } from 'react';
import { GoalCategory, CATEGORY_CONFIG } from '@/types/goal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface AddGoalDialogProps {
  onAdd: (data: {
    title: string;
    description: string;
    category: GoalCategory;
    targetDate: string;
    milestones: string[];
  }) => void;
}

const categories = Object.entries(CATEGORY_CONFIG) as [GoalCategory, { label: string; emoji: string }][];

const AddGoalDialog = ({ onAdd }: AddGoalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('personal');
  const [targetDate, setTargetDate] = useState('');
  const [milestones, setMilestones] = useState<string[]>(['']);

  const reset = () => {
    setTitle('');
    setDescription('');
    setCategory('personal');
    setTargetDate('');
    setMilestones(['']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;
    onAdd({ title: title.trim(), description: description.trim(), category, targetDate, milestones });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-heading">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Create a New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Run a marathon"
              required
            />
          </div>

          <div>
            <Label htmlFor="desc">Description (optional)</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this goal important to you?"
              rows={2}
            />
          </div>

          <div>
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {categories.map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    category === key
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
                  }`}
                >
                  {config.emoji} {config.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="date">Target Date</Label>
            <Input
              id="date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Milestones (optional)</Label>
            <div className="space-y-2 mt-1.5">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={m}
                    onChange={(e) => {
                      const next = [...milestones];
                      next[i] = e.target.value;
                      setMilestones(next);
                    }}
                    placeholder={`Milestone ${i + 1}`}
                  />
                  {milestones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setMilestones(milestones.filter((_, j) => j !== i))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMilestones([...milestones, ''])}
                className="text-xs"
              >
                + Add milestone
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full font-heading">
            Create Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;
