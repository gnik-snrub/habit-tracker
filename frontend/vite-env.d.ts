interface ImportMetaEnv {
  readonly VITE_TEST_USER: string
  readonly VITE_API_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
