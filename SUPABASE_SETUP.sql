/*
  FORCE SETUP SCRIPT - Futuristic AI Solutions (v3)
  Includes:
  - Table Cleanup
  - Schema Creation (With Trial Support)
  - AUTOMATIC PROFILE TRIGGER
  - Initial Data (With Trial Configuration)
*/

-- 1. Drop existing tables and functions to start clean
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 2. Create products table (Added trial_days)
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  monthly_price integer NOT NULL,
  yearly_price integer NOT NULL,
  trial_days integer DEFAULT 0,
  is_active boolean DEFAULT true,
  icon text DEFAULT 'Sparkles',
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Create user_profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  company_name text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Create subscriptions table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'active',
  billing_cycle text NOT NULL DEFAULT 'monthly',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  trial_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  CONSTRAINT valid_billing_cycle CHECK (billing_cycle IN ('monthly', 'yearly'))
);

-- 5. Create payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions ON DELETE SET NULL,
  amount integer NOT NULL,
  currency text DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending',
  payment_gateway text,
  gateway_transaction_id text,
  payment_method text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

-- 6. Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_product_id ON subscriptions(product_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);

-- 7. Security (Enable RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 8. Policies
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- RELAXED Insert Policy for user_profiles
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own subscriptions" ON subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscriptions" ON subscriptions FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own payments" ON payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own payments" ON payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 9. Automatic Profile Creation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Initial Data (Updated with Trial Days)
INSERT INTO products (name, slug, description, features, monthly_price, yearly_price, trial_days, icon, category) VALUES
  (
    'Futuristic Social AI',
    'social-ai',
    'AI-powered social media management and content creation. Automate posts, engage audiences, and grow your brand across Twitter, Discord, and more.',
    '["7-Day Free Trial", "AI content generation", "Multi-platform scheduling", "Audience engagement", "Brand voice training", "Analytics dashboard"]'::jsonb,
    79900,
    799000,
    7, 
    'MessageSquare',
    'social'
  ),
  (
    'Futuristic Automate AI',
    'automate-ai',
    'Intelligent browser automation for lead scraping, workflow automation, and B2B operations. No code required.',
    '["Visual workflow builder", "Smart web scraping", "Lead generation", "Data extraction", "Task scheduling", "API integration"]'::jsonb,
    149900,
    1499000,
    0,
    'Bot',
    'automation'
  ),
  (
    'Futuristic Hire AI',
    'hire-ai',
    'Complete AI hiring and HR CRM. Screen resumes, schedule interviews, conduct assessments, and manage your entire recruitment pipeline.',
    '["AI resume screening", "Interview scheduling", "Video interviews", "Skill assessments", "Candidate pipeline", "Work trial management"]'::jsonb,
    299900,
    2999000,
    0,
    'Users',
    'hr'
  ),
  (
    'Futuristic TradeLab',
    'tradelab',
    'AI trading research and simulation platform. Backtest strategies, analyze markets, and simulate signals. Research only - no real trading execution.',
    '["Strategy backtesting", "Market analysis", "Signal simulation", "Risk modeling", "Educational dashboards", "Performance tracking"]'::jsonb,
    99900,
    999000,
    0,
    'TrendingUp',
    'research'
  ),
  (
    'Futuristic Engage AI',
    'engage-ai',
    'AI-powered calling and WhatsApp automation. Intelligent conversations, appointment booking, and customer engagement at scale.',
    '["AI voice calls", "WhatsApp automation", "Conversation AI", "Appointment booking", "Lead qualification", "Multi-language support"]'::jsonb,
    199900,
    1999000,
    0,
    'Phone',
    'communication'
  );
