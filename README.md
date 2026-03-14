# Rediskai

Local Redis admin UI built with Next.js for managing connections, browsing keys, and inspecting values without leaving your machine.

## Highlights

- Save, rename, remove, and test multiple Redis connections
- Choose the active database before opening the browser
- Browse keys with `SCAN`, pattern filters, and incremental loading
- Inspect `string`, `hash`, `list`, `set`, `zset`, and `stream` values
- Edit string values, update TTL, delete keys, and copy values quickly
- Persist connection state locally in `data/connections.json`

## Tech stack

- Next.js 16 + React 19
- Tailwind CSS v4
- Gravity UI + Radix primitives
- ioredis
- Shiki
- Sonner
- rstest

## Requirements

- Node.js 20+
- pnpm 9+

## Getting started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`, add or test a connection on `/connections`, then open the Redis browser.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
pnpm typecheck
pnpm test
pnpm test:watch
```

## Project structure

```text
src/
  app/                    # Next.js routes and server actions
  components/
    connection-manager/   # Connection setup and management UI
    layout/               # Shared app shell
    redis-browser/        # Key listing, detail panel, and edit flows
    theme/                # Theme provider and toggle
    ui/                   # Shared UI helpers
  hooks/                  # Client-side state hooks
  lib/                    # Local persistence and helpers
  tests/                  # Test setup
  types/                  # Shared types
  utils/                  # Redis and formatting utilities
```

## Data storage

Connections are stored locally in:

```text
data/connections.json
```

The file is created automatically on first use.

## Notes

- String values that contain valid JSON are prettified before syntax highlighting.
- Non-string data types can be inspected today, but only string keys are editable.
- The browser route requires a previously tested healthy connection.

## Roadmap

### Current board
- [x] Connection management
- [x] Connection test before browser access
- [x] Active DB selection
- [x] Key list with `SCAN`, filters, and load more
- [x] Key details with syntax highlighting
- [x] Inspect `string`/`hash`/`list`/`set`/`zset`/`stream`
- [x] Edit string values and TTL
- [x] Delete keys
- [x] Retry states for browser errors

### Next
- [ ] Key editing for `hash`/`list`/`set`/`zset`/`stream`
- [ ] Key detail actions (`rename`, `duplicate`, `export`)
- [ ] Bulk operations (delete by pattern)
- [ ] Search history and favorites
- [ ] Persist selected DB per connection
- [ ] Metrics (key size, memory usage)

### UX
- [ ] Skeleton loading states
- [ ] Empty states tailored by data type
- [ ] Theme presets

## License

MIT
