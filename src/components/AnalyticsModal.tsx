import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { DbGoal } from '@/hooks/useGoals';
import { CATEGORY_CONFIG, GoalCategory } from '@/types/goal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalyticsModalProps {
  goals: DbGoal[];
}

const COLORS = ['hsl(152,45%,42%)', 'hsl(38,80%,58%)', 'hsl(200,60%,50%)', 'hsl(340,60%,55%)', 'hsl(270,50%,55%)'];

const AnalyticsModal = ({ goals }: AnalyticsModalProps) => {
  const categoryData = Object.entries(CATEGORY_CONFIG).map(([key, config], i) => {
    const catGoals = goals.filter(g => g.category === key);
    const avg = catGoals.length > 0 ? Math.round(catGoals.reduce((s, g) => s + g.progress, 0) / catGoals.length) : 0;
    return { name: `${config.emoji} ${config.label}`, count: catGoals.length, avg, fill: COLORS[i % COLORS.length] };
  }).filter(d => d.count > 0);

  const statusData = [
    { name: 'Active', value: goals.filter(g => g.status === 'active').length },
    { name: 'Completed', value: goals.filter(g => g.status === 'completed').length },
    { name: 'Archived', value: goals.filter(g => g.status === 'archived').length },
  ].filter(d => d.value > 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <BarChart3 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">Analytics</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Average Progress by Category</h3>
            {categoryData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {statusData.map(s => (
              <div key={s.name} className="rounded-lg border bg-card p-3 text-center">
                <p className="text-2xl font-heading font-bold text-card-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsModal;
