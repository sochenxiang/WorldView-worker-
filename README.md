# WorldView Cloudflare Workers + KV Version

This folder is a Cloudflare-native version of the backend.

## What it does

- Serves the static frontend from `public/`.
- Provides `/api/news`, `/api/health`, `/api/config`.
- Uses Cloudflare KV as the news cache.
- Runs a Cron job every 5 minutes.
- Each Cron run updates **one category**.
- Each category is stored in **one KV key**: `news:<category>`. Existing regional queues are merged with the newly fetched RSS batch.
- The value of `news:<category>` contains all continent queues.

## KV layout

```text
news:tech
news:finance
news:politics
news:general
news:environment
news:health
news:science
news:culture
scheduler:category-cursor
hash:<category>
```

Each `news:<category>` value contains:

```json
{
  "category": "tech",
  "updatedAt": "...",
  "regions": {
    "North America": [],
    "Europe": [],
    "Asia": [],
    "Africa": [],
    "South America": [],
    "Oceania": []
  }
}
```

## Setup

Install Wrangler:

```bash
npm install -g wrangler
```

Login:

```bash
wrangler login
```

Create KV namespace:

```bash
wrangler kv namespace create NEWS_KV
```

Copy the generated id into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "NEWS_KV"
id = "your_id_here"
```

Deploy:

```bash
cd cloudflare-worker-version
wrangler deploy
```

## Cron

The included `wrangler.toml` runs:

```cron
*/3 * * * *
```

That means every 5 minutes it updates one category and advances the cursor.

## Notes

- Users read cached news from KV, so page/API responses are fast.
- RSS source count is preserved in the Worker file, but updating is constrained by Worker limits.
- Each category writes only one news key, plus a cursor/hash key.
- The frontend in `public/` still uses `/api/news`, so it works on the same Worker domain.


## RSS batching

The Worker keeps all configured RSS sources, but it does not fetch every source in a single Cron run.
Each Cron run updates one category, all continents, and a small RSS batch (`FEED_BATCH_SIZE = 4`) plus Google News today/3d queries.
This keeps subrequests within the Cloudflare Workers free-plan limit while preserving the full source list over multiple cycles.
