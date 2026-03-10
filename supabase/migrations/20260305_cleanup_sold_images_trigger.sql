-- Migration: Create trigger to call cleanup-sold-images Edge Function
-- when a tractor's status changes to 'sold' or 'partial_payment'

-- Create the trigger function using Supabase's built-in net.http_post
CREATE OR REPLACE FUNCTION public.notify_cleanup_sold_images()
RETURNS trigger AS $$
BEGIN
  -- Only fire when status actually changed to sold or partial_payment
  IF OLD.status IS DISTINCT FROM NEW.status 
     AND NEW.status IN ('sold', 'partial_payment') THEN
    
    PERFORM net.http_post(
      url := 'https://dibqjjmsnjyijqlhdinf.supabase.co/functions/v1/cleanup-sold-images',
      body := jsonb_build_object(
        'type', 'UPDATE',
        'table', 'tractors',
        'schema', 'public',
        'record', to_jsonb(NEW),
        'old_record', to_jsonb(OLD)
      ),
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the tractors table
DROP TRIGGER IF EXISTS trigger_cleanup_sold_images ON public.tractors;
CREATE TRIGGER trigger_cleanup_sold_images
  AFTER UPDATE ON public.tractors
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_cleanup_sold_images();
