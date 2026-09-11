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

## Heritage Passport account storage
Heritage Passport progress is stored in Cloud Firestore under `users/{uid}/passport/progress`, tied to the authenticated Firebase user. This replaces browser-only `localStorage` for Passport progress, so each account keeps its own stamps and progress across browsers/devices. Deploy `firestore.rules` to the Firebase project before using the account-backed Passport in production.

## v16 cultural video background
The home hero now cycles through short, muted moving clips representing different Indian regions and traditions: Durga Puja (West Bengal), Ghoomar (Rajasthan), Onam (Kerala), Bihu (Assam), Badaga dance (Tamil Nadu), Dappu folk art (Telangana), and Thoda (Himachal Pradesh). The clips are used as a background playlist only; no hero layout, copy, controls, Firebase, Passport, or sidebar behavior is changed.

The external Wikimedia Commons media are used under the licenses stated on their respective file pages. Credits/sources:
- Durga Puja: https://commons.wikimedia.org/wiki/File:DurgaPuja2018_-_Pandal_of_Ahiritola_Sarbojonin_in_Kolkata_01.webm
- Ghoomar: https://commons.wikimedia.org/wiki/File:Ghoomar.ogv
- Onam: https://commons.wikimedia.org/wiki/File:Onam_celebration_in_a_campus_in_Keralam,_2026.webm
- Bihu: https://commons.wikimedia.org/wiki/File:Bihu_dancers_from_Dhakuakhana_Assam.webm
- Badaga dance: https://commons.wikimedia.org/wiki/File:Nilgiris_folk_badaga_dance.ogv
- Dappu: https://commons.wikimedia.org/wiki/File:Dappu_Folk_Artform_performance_in_Janapada_Jathara_(2018).webm
- Thoda: https://commons.wikimedia.org/wiki/File:Thoda_or_%E0%A4%A0%E0%A5%8B%E0%A4%A1%E0%A4%BE_01.webm

- v16 fixes the playlist playback bug: the active clip now uses native autoplay/muted playback and advances only after the actual video ends.
- Uses moving Wikimedia Commons footage from multiple Indian cultural traditions rather than a photo slideshow.


## Hidden Gems — nomination review flow

The Hidden Gems nomination form is cloud-backed. Submissions are written to the Firebase Firestore `hiddenGemNominations` collection with `status: "pending"`. Uploaded artist/craftsperson photos go to Firebase Storage under `hiddenGemPhotos/{nominationId}/...`; they are not stored in the project folder or browser localStorage.

Authorised admins can open `admin.html` and use the **Hidden Gems** tab to review each nomination and **Approve** or **Reject** it. Only approved nominations are queried and displayed publicly on the Hidden Gems page.

Before testing this workflow with Firebase, deploy both security files to the same Firebase project:

- `firestore.rules`
- `storage.rules`

The two authorised admin emails currently configured in the project are `sadik22319@gmail.com` and `rockysencr7@gmail.com`.
