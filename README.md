# Living India — Connected Full-Stack Prototype

## Run frontend
npm install
npm run dev

## Run backend
cd server
npm install
npm run dev

Frontend defaults to http://localhost:3001/api for API calls.
Set `VITE_API_URL` to change it.

## Connected features
- Live API health indicator
- Heritage search reads backend
- Heritage detail reads backend
- Community feed reads backend
- Comments are persisted by API
- Contributions are persisted with `pending_review`
- Contribution review status endpoint
- User records
- JSON persistence for zero-config prototype

## Production architecture
Replace server/data.json with PostgreSQL/Supabase; add JWT/OAuth authentication, object storage, moderation queue, expert verification, rate limiting, validation, audit logs, and AI services.


## Auth fix
This package uses one clean `auth.js` authentication UI. Legacy auth blocker/fallback scripts were removed. Login, signup with 6-digit email verification, password recovery, and Google OAuth are wired to Supabase.
