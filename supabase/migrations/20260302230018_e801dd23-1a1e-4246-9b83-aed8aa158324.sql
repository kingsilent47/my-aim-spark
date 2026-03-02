
-- Add sort_order column for drag-and-drop reordering
ALTER TABLE public.goals ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

-- Set initial sort orders based on existing order
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY pinned DESC, created_at DESC) as rn
  FROM public.goals
)
UPDATE public.goals SET sort_order = numbered.rn FROM numbered WHERE goals.id = numbered.id;
