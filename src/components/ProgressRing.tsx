import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

const ProgressRing = ({ progress, size = 56, strokeWidth = 4.5 }: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // Color transitions based on progress
  const getStrokeColor = () => {
    if (progress >= 100) return 'hsl(var(--success))';
    if (progress >= 60) return 'hsl(var(--primary))';
    if (progress >= 30) return 'hsl(var(--accent))';
    return 'hsl(var(--muted-foreground))';
  };

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--progress-bg))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            filter: progress >= 100 ? 'drop-shadow(0 0 4px hsl(var(--success) / 0.4))' : undefined,
          }}
        />
      </svg>
      <motion.span
        key={progress}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute text-xs font-heading font-bold text-foreground"
      >
        {progress}%
      </motion.span>
    </div>
  );
};

export default ProgressRing;
