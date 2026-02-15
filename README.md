# Rediskai

Local Redis admin UI built with Next.js. Manage connections, browse keys, and inspect values locally.

## Highlights

- Multiple saved Redis connections
- Active connection + DB index selection
- Key browsing with SCAN, filters, and pagination
- Key detail view with Shiki syntax highlighting
- String edit + TTL update + key delete

## Tech stack

- Next.js + React
- Tailwind CSS v4
- Shadcn UI components
- ioredis
- Shiki
- Sonner (toasts)

## Requirements

- Node.js 20+ (tested in CI on 20, 21, 22)
- pnpm 9+

## Getting started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
pnpm typecheck
```

## Project structure

```
src/
  app/               # Next.js routes and server actions
  components/
    connection-manager/   # Connection UI
    redis-browser/        # Keys browser + details
    ui/                   # shadcn ui components
    theme/                # Theme provider + toggle
    layout/               # App shell
  lib/               # Persistence helpers
  types/             # Shared types by context
  utils/             # Utilities (formatters, redis helpers)
```

## Data storage

Connections are stored locally at:

```
data/connections.json
```

## Formatting notes

- String values that contain JSON are formatted using `JSON.stringify(..., 2)` before highlighting.
- Non-string keys remain read-only for now.

## Roadmap

### Functional (MVP)
- [x] Connection management
- [x] Active DB selection
- [x] Key list with SCAN
- [x] Key details + syntax highlight
- [x] Edit string values + TTL
- [x] Delete keys

### Next
- [ ] Key editing for hash/list/set/zset/stream
- [ ] Key detail actions (rename, duplicate, export)
- [ ] Bulk operations (delete by pattern)
- [ ] Search history + favorites
- [ ] Database switch per connection (persisted)
- [ ] Metrics: key size, memory usage

### UX
- [ ] Skeleton loading states
- [ ] Better error surfaces + retry actions
- [ ] Empty states for each data type
- [ ] Theme presets

## License

MIT
