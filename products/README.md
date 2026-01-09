# Futuristic AI Solutions - Product Setup

## 1. Futuristic Social AI (Eliza)

The repository is currently cloning into `social-ai`.
Once finished, please perform the following steps:

1.  **Rename Project**: Open `products/social-ai/package.json` and change `"name"` to `"futuristic-social-ai"`.
2.  **Remove Crypto Features**:
    *   Delete `packages/plugin-solana`, `packages/plugin-evm`, etc.
    *   Remove them from `package.json` dependencies.
    *   Remove them from `agent/src/index.ts` (or equivalent entry point) where plugins are registered.
3.  **Add Authentication**:
    *   Copy the Shared Auth Service (`supabase`) logic to the agent.
    *   Ensure the agent checks `subscriptions` table before running actions.

### Subscription Check Code
Use this snippet in your agent's action handler:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSubscription(userId: string) {
  const { data } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
    
  return !!data;
}
```

## 2. Futuristic Automate AI (Skyvern) (Phase 2)
Run:
```bash
git clone https://github.com/Skyvern-AI/skyvern automate-ai
```
Follow similar rebranding steps.
