# Rediskai

UI local para administrar Redis com Next.js. Gerencie conexões, navegue por chaves e visualize valores localmente.

## Destaques

- Múltiplas conexões Redis salvas
- Conexão ativa + seleção de DB
- Lista de chaves via SCAN com filtro e paginação
- Detalhes com highlight usando Shiki
- Edição de string + TTL + delete

## Stack

- Next.js + React
- Tailwind CSS v4
- Shadcn UI
- ioredis
- Shiki
- Sonner (toasts)

## Requisitos

- Node.js 20+ (testado no CI em 20, 21, 22)
- pnpm 9+

## Como rodar

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
pnpm typecheck
```

## Organização de arquivos

```
src/
  app/               # Rotas e server actions
  components/
    connection-manager/   # UI de conexões
    redis-browser/        # Navegador de chaves + detalhes
    ui/                   # Componentes shadcn
    theme/                # Theme provider + toggle
    layout/               # App shell
  lib/               # Persistência local
  types/             # Tipos por contexto
  utils/             # Utilitários (formatters, redis helpers)
```

## Armazenamento

As conexões são salvas localmente em:

```
data/connections.json
```

## Formatação

- Strings que são JSON válidos são formatadas com `JSON.stringify(..., 2)`.
- Tipos não-string seguem somente leitura por enquanto.

## Roadmap

### Funcional (MVP)
- [x] Gerenciar conexões
- [x] Selecionar DB ativo
- [x] Lista de chaves via SCAN
- [x] Detalhes + highlight
- [x] Edição de string + TTL
- [x] Delete de chave

### Próximos passos
- [ ] Edição de hash/list/set/zset/stream
- [ ] Ações no detalhe (renomear, duplicar, exportar)
- [ ] Operações em massa (delete por pattern)
- [ ] Histórico de busca + favoritos
- [ ] Persistir DB por conexão
- [ ] Métricas: tamanho da chave, uso de memória

### UX
- [ ] Skeletons de loading
- [ ] Erros com retry
- [ ] Empty states por tipo
- [ ] Presets de tema

## Licença

MIT
