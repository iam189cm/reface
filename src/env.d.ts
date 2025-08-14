/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string


  readonly VITE_OSS_REGION: string
  readonly VITE_OSS_BUCKET: string
  readonly VITE_OSS_ACCESS_KEY_ID: string
  readonly VITE_OSS_ACCESS_KEY_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
