import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, subDays, startOfDay, eachDayOfInterval, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActivityDay {
  date: Date;
  count: number;
}

const StreakCalendar = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    const from = format(subDays(new Date(), 83), 'yyyy-MM-dd');
    supabase
      .from('activity_log')
      .select('date')
      .eq('user_id', user.id)
      .gte('date', from)
      .then(({ data }) => {
        if (!data) return;
        const counts: Record<string, number> = {};
        data.forEach(r => { counts[r.date] = (counts[r.date] || 0) + 1; });
        setActivities(Object.entries(counts).map(([date, count]) => ({ date, count })));
      });
  }, [user]);

  const { days, currentStreak } = useMemo(() => {
    const today = startOfDay(new Date());
    const start = subDays(today, 83);
    const allDays = eachDayOfInterval({ start, end: today });

    const dayData: ActivityDay[] = allDays.map(d => {
      const match = activities.find(a => isSameDay(new Date(a.date + 'T00:00:00'), d));
      return { date: d, count: match?.count || 0 };
    });

    let streak = 0;
    for (let i = dayData.length - 1; i >= 0; i--) {
      if (dayData[i].count > 0) streak++;
      else break;
    }

    return { days: dayData, currentStreak: streak };
  }, [activities]);

  const maxCount = Math.max(1, ...days.map(d => d.count));

  const getIntensity = (count: number): string => {
    if (count === 0) return 'bg-muted/60';
    const ratio = count / maxCount;
    if (ratio <= 0.33) return 'bg-primary/25';
    if (ratio <= 0.66) return 'bg-primary/55';
    return 'bg-primary shadow-glow';
  };

  const weeks: ActivityDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.4 }}
      className="rounded-lg border border-border bg-card p-5 card-premium"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-sm text-card-foreground">Activity Streak</h3>
        {currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="flex items-center gap-1.5 text-sm font-semibold text-accent"
          >
            <Flame className="w-4 h-4 animate-float" />
            <span>{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span>
          </motion.div>
        )}
      </div>
      <TooltipProvider delayDuration={100}>
        <div className="flex gap-[3px] overflow-x-auto">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <Tooltip key={di}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: wi * 0.01 + di * 0.005, duration: 0.2 }}
                      className={`w-3 h-3 rounded-[3px] transition-all duration-200 hover:scale-125 ${getIntensity(day.count)}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p>{format(day.date, 'MMM d')}: {day.count} action{day.count !== 1 ? 's' : ''}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
      </TooltipProvider>
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 rounded-[3px] bg-muted/60" />
        <div className="w-3 h-3 rounded-[3px] bg-primary/25" />
        <div className="w-3 h-3 rounded-[3px] bg-primary/55" />
        <div className="w-3 h-3 rounded-[3px] bg-primary" />
        <span>More</span>
      </div>
    </motion.div>
  );
};

export default StreakCalendar;
