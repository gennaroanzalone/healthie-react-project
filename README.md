# Rick & Morty Kanban

A frontend-only Kanban board built with **React + TypeScript + Vite**. Create
tasks, assign each a character pulled live from the
[Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql), and drag them
across **To Do → Doing → Done**. Landing a task in **Done** triggers a confetti
celebration. Board state persists to `localStorage`.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build    # type-check (tsc) + production build
npm run lint     # eslint
npm run test     # vitest unit tests for the board logic
```

## Features

- **Three columns**: To Do, Doing, Done.
- **Create tasks via a form** — each task requires a title and a Rick and Morty
  character (loaded from the GraphQL API, with loading/error/success states).
- **Drag and drop** between columns and reordering within a column, powered by
  [`@dnd-kit`](https://dndkit.com/) (mouse, touch, and keyboard supported).
- **Delight**: confetti fires when a task arrives in Done from another column.
- **Persistence**: the board survives a page refresh via `localStorage`.

## Architecture

```
src/
  api/characters.ts        # GraphQL fetch (plain fetch, no client lib)
  hooks/
    useCharacters.ts       # loads characters; loading/error/success
    useBoard.ts            # board state + localStorage persistence
  lib/board.ts             # pure board mutations (unit-tested)
  components/
    Board/                 # DndContext + orchestration
    Column/                # droppable + sortable container
    Card/                  # presentational Card + SortableCard wrapper
    AddItemForm/           # task creation form
  utils/celebrate.ts       # confetti burst
  types.ts, constants.ts
```

Board mutations live as pure functions in `src/lib/board.ts` so the drag-and-drop
handlers and form stay thin, and the logic is straightforward to unit-test
(`src/lib/board.test.ts`).

## Tech choices

| Concern        | Choice                          |
| -------------- | ------------------------------- |
| Build tool     | Vite (`react-ts`)               |
| Drag & drop    | `@dnd-kit/core` + `/sortable`   |
| Data fetching  | Plain `fetch` in a custom hook  |
| Styling        | CSS Modules                     |
| Confetti       | `canvas-confetti`               |
| Tests          | Vitest                          |
