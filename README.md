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

## Explore Experience Fixes
The Explore Hub now uses distinct media and dedicated interactions for each path: Interactive Explorer hotspots, a timeline, step-by-step process, culture connections, community-memory cards, audio playback, a before/after slider, reveal cards, and an interactive quiz. Explore media/audio references use Wikimedia Commons sources.

Explore Experience v20 updates:
- Replaced generic Explore text with heritage-specific verified timelines, making/process notes, culture connections, surprise facts and quizzes for Madhubani Painting, Baul Music, Kalamkari, Theyyam, Pattachitra and Harappa.
- Timeline cards now show period/year labels and fuller historical explanations; no artificial founding year is invented where sources do not support one.
- Listen & Explore now has a prominent Play/Pause button plus the native audio controls and uses the Wikimedia Commons Theyyam Meelam recording for the current Theyyam experience.
- Added visible source links to the official/primary references used for each heritage experience.

## Dynamic Ways to Explore (category-aware)
- The Explore Hub no longer shows a fixed 10-way menu for every heritage.
- Available experiences are selected from the heritage's type/category/interest.
- Historical/architectural entries focus on visual exploration, timeline, connections, community stories, before/after, surprises and quiz; audio is omitted unless the record indicates music/performance.
- Music/oral heritage includes Listen & Explore; crafts/visual arts include How It's Made; performance/ritual/festival heritage can include process, community, audio and before/after.
- Food and language records receive only relevant experiences.
- The Passport destination is not counted as an Explore path, and completion is calculated against the relevant paths for that heritage.

## v28 compact curated Explore UI
- Ways to Explore now renders one compact curated grid using only relevant experiences for the selected heritage.
- Removed the fixed grouped 10-way presentation.
- Passport progress uses the actual relevant experience count instead of a hard-coded /9.
