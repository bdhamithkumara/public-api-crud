# Public API CRUD Admin Dashboard

A simple Next.js App Router admin dashboard for Sri Lankan public location data using PostgreSQL on Neon, the `pg` library, and raw SQL.

## Tech Stack

- Next.js 14 App Router
- PostgreSQL / Neon
- `pg` library, no ORM
- Tailwind CSS
- Node.js JSON backup scripts

## Folder Structure

```txt
app/
  api/
    provinces/route.ts
    provinces/[id]/route.ts
    districts/route.ts
    districts/[id]/route.ts
    divisional-secretariats/route.ts
    divisional-secretariats/[id]/route.ts
    cities/route.ts
    cities/[id]/route.ts
    export/route.ts
    import/route.ts
  provinces/page.tsx
  districts/page.tsx
  divisional-secretariats/page.tsx
  cities/page.tsx
components/
  AdminForm.tsx
  DataTable.tsx
  ResourcePage.tsx
lib/
  api.ts
  backup.ts
  db.ts
  types.ts
scripts/
  db.js
  exportData.js
  importData.js
sql/
  schema.sql
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

3. Add your Neon connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"
```

4. Run the schema in Neon SQL editor or with your preferred SQL client:

```bash
sql/schema.sql
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Admin Pages

- `/provinces`
- `/districts`
- `/divisional-secretariats`
- `/cities`

`/districts` is the fully worked example page. It uses a province dropdown instead of manual ID entry. The DS and cities pages use the same pattern with district dropdowns.

## API Routes

Each resource supports:

- `GET /api/{resource}`
- `POST /api/{resource}`
- `PUT /api/{resource}/{id}`
- `DELETE /api/{resource}/{id}`

Resources:

- `provinces`
- `districts`
- `divisional-secretariats`
- `cities`

Backup routes:

- `GET /api/export` returns the full JSON backup
- `POST /api/import` accepts backup JSON and restores it

## JSON Backup

Export all tables into `backup.json`:

```bash
npm run export:data
```

The output shape is:

```json
{
  "provinces": [],
  "districts": [],
  "divisional_secretariats": [],
  "cities": []
}
```

## JSON Restore

Restore from `backup.json`:

```bash
npm run import:data
```

The import inserts in the correct order:

```txt
provinces -> districts -> divisional_secretariats -> cities
```

It uses `INSERT ... ON CONFLICT (id) DO NOTHING` and resets all `SERIAL` sequences afterward with `setval()`.

## Notes

- No ORM is used.
- API routes do not write files, which keeps them serverless-friendly.
- File-based backup and restore happen only in `scripts/`.
- Deleting parent records may fail if related child records still exist because foreign keys use `ON DELETE RESTRICT`.
