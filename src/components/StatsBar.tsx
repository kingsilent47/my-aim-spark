import { motion } from 'framer-motion';
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
    { label: 'Total Goals', value: total, icon: Target, color: 'text-primary' },
    { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-accent' },
    { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-success' },
    { label: 'Avg Progress', value: `${avgProgress}%`, icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 card-premium"
        >
          <div className="rounded-lg bg-primary/8 p-2.5">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </div>
          <div>
            <motion.p
              key={String(stat.value)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-heading font-bold text-card-foreground"
            >
              {stat.value}
            </motion.p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
