# Widget Position Migration

This migration adds support for configurable widget positioning in the Feedbackito application.

## What This Migration Does

1. **Adds a new column** `widget_position` to the `surveys` table
2. **Sets default value** to `'bottom-right'` (current behavior)
3. **Adds validation** to ensure only valid position values are allowed
4. **Updates existing records** to have the default value
5. **Adds an index** for better query performance

## Why Surveys Table Instead of Spaces?

The widget position is now configured at the **survey level** rather than the space level because:

- **Different surveys** might need different positioning strategies
- **A/B testing** different positions for different surveys
- **Survey-specific positioning** based on content or target audience
- **More granular control** over user experience
- **Better alignment** with survey-specific settings like themes and targeting

## Valid Widget Positions

- `bottom-right` (default): Widget appears at the bottom-right corner of the screen
- `lateral-right`: Widget appears on the right side of the screen, centered vertically (like Hotjar)

## How to Apply the Migration

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `scripts/add-widget-position-migration.sql`
4. Click "Run" to execute the migration

### Option 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 3: Direct Database Connection

If you have direct access to your PostgreSQL database:

```bash
psql -h your-host -U your-user -d your-database -f scripts/add-widget-position-migration.sql
```

## What Happens After Migration

1. **Existing surveys** will continue to work with the widget at the bottom-right (default behavior)
2. **Users can now choose** between bottom-right and lateral-right positioning when creating new surveys
3. **New surveys** will default to bottom-right positioning
4. **Widget positioning** will be automatically applied based on the survey configuration

## How to Configure Widget Position

After applying the migration:

1. Go to your dashboard
2. Click **"Create New Survey"** or edit an existing survey
3. In the **Customization** section, you'll see a new "Widget Position" dropdown
4. Choose between:
   - **Bottom Right**: Traditional positioning
   - **Right Side (Centered)**: Hotjar-style positioning
5. Save your survey

## Testing the Migration

After applying the migration:

1. Create a new survey or edit an existing one
2. In the Customization section, select "Right Side (Centered)" for widget position
3. Save the survey
4. The widget should now appear on the right side of the screen, centered vertically

## Rollback (If Needed)

If you need to rollback this migration:

```sql
-- Remove the column and related objects
ALTER TABLE public.surveys DROP COLUMN IF EXISTS widget_position;
DROP INDEX IF EXISTS idx_surveys_widget_position;
```

**Note**: Rolling back will remove all widget position customizations and revert to the default bottom-right positioning.

## Browser Compatibility

The new positioning uses CSS transforms (`translateY(-50%)`) which are supported in all modern browsers:
- Chrome 4+
- Firefox 3.5+
- Safari 3.1+
- Edge 12+
- IE 9+

## Support

If you encounter any issues with this migration, please check:
1. Your Supabase project permissions
2. Database connection status
3. Any existing constraints that might conflict

The migration is designed to be safe and non-destructive, so existing functionality should remain intact.

## API Changes

The widget position API endpoint now fetches from the surveys table:
- **Before**: `/api/widget/position?space_id=X` → fetched from `spaces` table
- **After**: `/api/widget/position?space_id=X` → fetches from `surveys` table (most recent active survey)

This ensures that the widget position is always based on the current active survey configuration.
