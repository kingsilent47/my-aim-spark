import { motion } from 'framer-motion';
import { Target, Sparkles } from 'lucide-react';

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 p-6 mb-6 shadow-glow"
    >
      <Target className="w-10 h-10 text-primary" />
    </motion.div>
    <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
      No goals yet
    </h2>
    <p className="text-muted-foreground max-w-sm leading-relaxed mb-4">
      Set your first goal and start tracking your progress. Every journey begins with a single step.
    </p>
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Sparkles className="w-3.5 h-3.5 text-accent" />
      <span>Click "New Goal" above to get started</span>
    </div>
  </motion.div>
);

export default EmptyState;
