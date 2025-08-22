-- Migration: Add widget_position column to surveys table
-- This migration adds a new column to control widget positioning for individual surveys

-- Add the widget_position column with a default value
ALTER TABLE public.surveys 
ADD COLUMN IF NOT EXISTS widget_position TEXT DEFAULT 'bottom-right';

-- Add a check constraint to ensure only valid values are allowed
ALTER TABLE public.surveys 
ADD CONSTRAINT check_surveys_widget_position 
CHECK (widget_position IN ('bottom-right', 'lateral-right'));

-- Update existing records to have the default value
UPDATE public.surveys 
SET widget_position = 'bottom-right' 
WHERE widget_position IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE public.surveys 
ALTER COLUMN widget_position SET NOT NULL;

-- Add an index for better query performance
CREATE INDEX IF NOT EXISTS idx_surveys_widget_position 
ON public.surveys(widget_position);

-- Add comment to document the column
COMMENT ON COLUMN public.surveys.widget_position IS 'Controls the position of the feedback widget for this specific survey. Options: bottom-right (default), lateral-right (centered on right side)';
