import { DbGoal } from '@/hooks/useGoals';
import { Target, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

interface StatsBarProps {
  goals: DbGoal[];
}

const StatsBar = ({ goals }: StatsBarProps) => {
  const total = goals.length;
  const completed = goals.filter(g => g.status === 'completed' || g.progress === 100).length;
  const avgProgress = total > 0 ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / total) : 0;
  const inProgress = goals.filter(g => g.status === 'active' && g.progress > 0 && g.progress < 100).length;

  const stats = [
    { label: 'Total Goals', value: total, icon: Target },
    { label: 'In Progress', value: inProgress, icon: Clock },
    { label: 'Completed', value: completed, icon: CheckCircle2 },
    { label: 'Avg Progress', value: `${avgProgress}%`, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(stat => (
        <div key={stat.label} className="flex items-center gap-3 rounded-lg border bg-card p-4">
          <div className="rounded-md bg-primary/10 p-2"><stat.icon className="w-4 h-4 text-primary" /></div>
          <div>
            <p className="text-xl font-heading font-bold text-card-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
