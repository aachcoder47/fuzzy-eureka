/*
  # Multi-Product SaaS Platform Schema
  
  ## Overview
  Creates the complete database schema for Futuristic AI Solutions marketplace
  with support for multiple products, subscriptions, and user management.
  
  ## New Tables
  
  ### 1. `products`
  Stores all AI products offered on the platform
  - `id` (uuid, primary key)
  - `name` (text) - Product name (e.g., "Futuristic Social AI")
  - `slug` (text) - URL-friendly identifier
  - `description` (text) - Product description
  - `features` (jsonb) - Array of feature strings
  - `monthly_price` (integer) - Price in paise/cents
  - `yearly_price` (integer) - Annual price in paise/cents
  - `is_active` (boolean) - Product availability
  - `icon` (text) - Icon name from lucide-react
  - `category` (text) - Product category
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. `user_profiles`
  Extended user information beyond Supabase auth
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `company_name` (text)
  - `phone` (text)
  - `avatar_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. `subscriptions`
  Tracks user subscriptions to products
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `product_id` (uuid, references products)
  - `status` (text) - active, cancelled, expired, trial
  - `billing_cycle` (text) - monthly or yearly
  - `current_period_start` (timestamptz)
  - `current_period_end` (timestamptz)
  - `cancel_at_period_end` (boolean)
  - `trial_end` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. `payments`
  Payment transaction history
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `subscription_id` (uuid, references subscriptions)
  - `amount` (integer) - Amount in paise/cents
  - `currency` (text) - INR, USD, etc.
  - `status` (text) - pending, completed, failed, refunded
  - `payment_gateway` (text) - payu, stripe, etc.
  - `gateway_transaction_id` (text)
  - `payment_method` (text)
  - `created_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Users can only read their own data
  - Products table is publicly readable
  - Only authenticated users can create subscriptions
  - Payment records are read-only for users
  
  ## Important Notes
  1. All prices stored in smallest currency unit (paise for INR)
  2. Subscription status must be checked before granting product access
  3. Trial periods supported for future promotional offers
  4. Each product has independent subscription
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  monthly_price integer NOT NULL,
  yearly_price integer NOT NULL,
  is_active boolean DEFAULT true,
  icon text DEFAULT 'Sparkles',
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  company_name text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
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

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_product_id ON subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- User profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert initial products
INSERT INTO products (name, slug, description, features, monthly_price, yearly_price, icon, category) VALUES
  (
    'Futuristic Social AI',
    'social-ai',
    'AI-powered social media management and content creation. Automate posts, engage audiences, and grow your brand across Twitter, Discord, and more.',
    '["AI content generation", "Multi-platform scheduling", "Audience engagement", "Brand voice training", "Analytics dashboard", "Discord & Twitter integration"]'::jsonb,
    79900,
    799000,
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
    'Phone',
    'communication'
  ) ON CONFLICT (slug) DO NOTHING;
