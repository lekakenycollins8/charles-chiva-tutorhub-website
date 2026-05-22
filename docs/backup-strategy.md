# Backup & Disaster Recovery Strategy

## Database: Neon PostgreSQL

### Automatic Backups (Built-in)

Neon provides point-in-time restore (PITR) out of the box:

| Plan | Retention | Restore Granularity |
|------|-----------|---------------------|
| Free | 7 days | Any point in the window |
| Launch | 14 days | Any point in the window |
| Scale | 30 days | Any point in the window |

To restore: Neon Console → Project → Restore → select timestamp.

### Manual Backup Procedure

Run before any destructive schema change or major data operation:

```bash
# Requires pg_dump installed (ships with PostgreSQL client tools)
pg_dump \
  --no-acl \
  --no-owner \
  --format=custom \
  --file="backups/chiva-tutorhub-$(date +%Y%m%d-%H%M%S).dump" \
  "$DIRECT_URL"
```

Restore from a dump:

```bash
pg_restore \
  --no-acl \
  --no-owner \
  --clean \
  --if-exists \
  --dbname="$DIRECT_URL" \
  backups/chiva-tutorhub-YYYYMMDD-HHMMSS.dump
```

Store dump files in: `backups/` (git-ignored via `.gitignore`).

### Prisma Migration Safety

- **Never run `prisma migrate reset` in production** — this drops and recreates all tables.
- **Always run `prisma migrate status` before deploying** to confirm no unapplied migrations.
- **New migrations are applied automatically on Vercel deploy** via the `postinstall` script running `prisma generate`. Add `prisma migrate deploy` to your deployment pipeline to apply migrations.

Recommended `package.json` deployment script:

```json
"scripts": {
  "migrate:deploy": "prisma migrate deploy"
}
```

And in Vercel: set **Build Command** to `prisma migrate deploy && next build`.

---

## File Storage: Cloudinary

All uploaded files (images, videos, documents) are stored in Cloudinary, not in the database. The database only stores the `secure_url`.

- Cloudinary provides its own backup via **Media Library backups** (paid plans).
- For free-tier protection: periodically export the URL list from the database and store it externally.

---

## Environment Variables

**Never commit `.env` or `.env.local` to source control.**

Store all production secrets in Vercel Environment Variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `DIRECT_URL` | Neon direct (non-pooled) connection string |
| `NEXTAUTH_SECRET` | NextAuth JWT signing secret |
| `JWT_SECRET` | Download token signing secret |
| `CLOUDINARY_*` | Cloudinary API credentials |
| `INTASEND_*` | IntaSend payment gateway keys |

Rotate secrets immediately if a leak is suspected.

---

## Disaster Recovery Runbook

### Scenario 1 — Accidental table DROP
1. Go to Neon Console → Project → Restore.
2. Select a timestamp before the DROP event.
3. Restore to a new branch, verify data integrity, then promote to production.

### Scenario 2 — Bad migration applied
1. Run `prisma migrate status` to confirm the migration that was applied.
2. Write a new corrective migration (`prisma migrate dev --name fix_...`).
3. **Do not** use `prisma migrate reset` — this destroys production data.

### Scenario 3 — Complete database loss
1. Check Neon PITR — restore to the most recent clean snapshot.
2. If Neon is unavailable: restore from the most recent `pg_dump` file.
3. Re-run `prisma migrate deploy` to ensure migration history table is in sync.
4. Re-run `npx prisma db seed` if no users exist (creates default admin).

### Scenario 4 — Compromised credentials
1. Rotate all Vercel environment variables immediately.
2. Rotate Neon database password (Neon Console → Settings → Connection).
3. Rotate Cloudinary API key.
4. Rotate IntaSend keys.
5. Rotate `NEXTAUTH_SECRET` and `JWT_SECRET` — this invalidates all existing sessions and download tokens.
