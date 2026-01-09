import { useEffect, useState } from 'react';
import { supabase, Subscription, Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type SubscriptionWithProduct = Subscription & {
  product: Product;
};

export function useSubscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    async function fetchSubscriptions() {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select(`
            *,
            product:products(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSubscriptions((data || []) as SubscriptionWithProduct[]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();
  }, [user]);

  const hasActiveSubscription = (productId: string): boolean => {
    return subscriptions.some(
      (sub) => sub.product_id === productId && sub.status === 'active'
    );
  };

  return { subscriptions, loading, error, hasActiveSubscription };
}
