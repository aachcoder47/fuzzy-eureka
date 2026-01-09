/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_RAZORPAY_PLAN_MONTHLY: string
    readonly VITE_RAZORPAY_PLAN_YEARLY: string
    readonly NEXT_PUBLIC_RAZORPAY_KEY_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface Window {
    Razorpay: any;
}
