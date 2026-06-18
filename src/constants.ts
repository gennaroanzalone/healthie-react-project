export const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
] as const;

export type ColumnId = (typeof COLUMNS)[number]['id'];

export const STORAGE_KEY = 'kanban-board-v1';
