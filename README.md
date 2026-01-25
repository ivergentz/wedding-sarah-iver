# Sarah & Iver Wedding Website

Hochzeitswebsite mit RSVP-Funktion und Admin Dashboard.

## Tech Stack

- React 19
- Styled Components
- Supabase (Datenbank)
- Vercel (Hosting)

## Setup

### 1. Supabase

1. Neues Projekt erstellen auf supabase.com
2. SQL Editor öffnen
3. `supabase-setup.sql` ausführen
4. Project URL und Anon Key kopieren

### 2. Vercel Environment Variables

```
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGci...
```

### 3. Deploy

```bash
cd client
npm install
npm run build
```

## Seiten

- `/` - Hauptseite mit RSVP Formular
- `/admin` - Admin Dashboard (Login: Sarover / wedding2026!#*)

## Admin Features

- RSVP Übersicht (Name, Status, Personen, Nachricht)
- Statistiken (Zusagen, Absagen, Gesamtgäste)
- CSV Export

© 2026 Sarah & Iver
