-- Find and delete the failed HR subscription
-- Run this in your Supabase SQL Editor

-- First, let's see all subscriptions to identify the HR one
SELECT 
  s.id,
  s.status,
  p.name as product_name,
  s.created_at,
  s.current_period_end
FROM subscriptions s
JOIN products p ON s.product_id = p.id
ORDER BY s.created_at DESC;

-- Once you identify the HR subscription ID, delete it with:
-- DELETE FROM subscriptions WHERE id = 'paste-subscription-id-here';

-- Or delete by product name:
DELETE FROM subscriptions 
WHERE product_id = (
  SELECT id FROM products WHERE name = 'Futuristic Hire AI'
)
AND status = 'active'
AND created_at > NOW() - INTERVAL '1 hour';  -- Only delete recent ones

-- Verify deletion
SELECT 
  s.id,
  p.name as product_name,
  s.status
FROM subscriptions s
JOIN products p ON s.product_id = p.id
WHERE p.name = 'Futuristic Hire AI';
