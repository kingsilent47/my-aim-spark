import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="rounded-full bg-primary/10 p-5 mb-5">
      <Target className="w-10 h-10 text-primary" />
    </div>
    <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
      No goals yet
    </h2>
    <p className="text-muted-foreground max-w-sm">
      Set your first goal and start tracking your progress. Every journey begins with a single step.
    </p>
  </motion.div>
);

export default EmptyState;
