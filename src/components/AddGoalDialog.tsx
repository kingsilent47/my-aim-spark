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
        <Button className="gap-2 font-heading btn-press shadow-soft">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">Create a New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-3">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Run a marathon"
              className="transition-shadow focus:shadow-soft"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description (optional)</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this goal important to you?"
              rows={2}
              className="transition-shadow focus:shadow-soft"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {categories.map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`filter-pill ${category === key ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                >
                  {config.emoji} {config.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Target Date</Label>
            <Input
              id="date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="transition-shadow focus:shadow-soft"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Milestones (optional)</Label>
            <div className="space-y-2 mt-1">
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
                    className="transition-shadow focus:shadow-soft"
                  />
                  {milestones.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="btn-press"
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
                className="text-xs btn-press"
              >
                + Add milestone
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full font-heading btn-press shadow-soft">
            Create Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;
