/** Base do backend (sem barra final). No `.env`: `VITE_API_URL=https://teu-api.com` — só URL pública, nunca segredos. */
export const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
