# Rediskai

UI local para administrar Redis com Next.js, gerenciar conexões, navegar por chaves e inspecionar valores sem sair da sua máquina.

## Destaques

- Salva, renomeia, remove e testa múltiplas conexões Redis
- Permite escolher o banco ativo antes de abrir o browser
- Navega por chaves com `SCAN`, filtro por pattern e carregamento incremental
- Inspeciona valores `string`, `hash`, `list`, `set`, `zset` e `stream`
- Edita strings, atualiza TTL, remove chaves e copia valores rapidamente
- Persiste o estado localmente em `data/connections.json`

## Stack

- Next.js 16 + React 19
- Tailwind CSS v4
- Gravity UI + primitivas Radix
- ioredis
- Shiki
- Sonner
- rstest

## Requisitos

- Node.js 20+
- pnpm 9+

## Como rodar

```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`, configure ou teste uma conexão em `/connections` e depois abra o browser Redis.

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

## Organização de arquivos

```text
src/
  app/                    # Rotas e server actions
  components/
    connection-manager/   # UI de configuração e gestão de conexões
    layout/               # App shell compartilhado
    redis-browser/        # Lista de chaves, detalhe e edição
    theme/                # Theme provider e toggle
    ui/                   # Helpers de UI
  hooks/                  # Hooks de estado no client
  lib/                    # Persistência local e helpers
  tests/                  # Setup de testes
  types/                  # Tipos compartilhados
  utils/                  # Utilitários de Redis e formatação
```

## Armazenamento

As conexões são salvas localmente em:

```text
data/connections.json
```

O arquivo é criado automaticamente no primeiro uso.

## Observações

- Strings que contêm JSON válido são formatadas antes do syntax highlight.
- Tipos não-string já podem ser inspecionados, mas somente chaves `string` podem ser editadas.
- A rota do browser exige uma conexão previamente testada com sucesso.

## Roadmap

### Board atual
- [x] Gerenciamento de conexões
- [x] Teste de conexão antes de abrir o browser
- [x] Seleção de DB ativo
- [x] Lista de chaves com `SCAN`, filtros e carregar mais
- [x] Detalhes com syntax highlight
- [x] Inspeção de `string`/`hash`/`list`/`set`/`zset`/`stream`
- [x] Edição de string e TTL
- [x] Delete de chave
- [x] Estados de retry para erros no browser

### Próximos passos
- [ ] Edição de `hash`/`list`/`set`/`zset`/`stream`
- [ ] Ações no detalhe (`rename`, `duplicate`, `export`)
- [ ] Operações em massa (delete por pattern)
- [ ] Histórico de busca e favoritos
- [ ] Persistir DB selecionado por conexão
- [ ] Métricas (tamanho da chave, uso de memória)

### UX
- [ ] Skeletons de loading
- [ ] Empty states por tipo
- [ ] Presets de tema

## Licença

MIT
