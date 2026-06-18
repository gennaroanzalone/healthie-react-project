import { COLUMNS, STORAGE_KEY, type ColumnId } from '../constants';
import type { KanbanItem } from '../types';

export type BoardState = Record<ColumnId, KanbanItem[]>;

export const createEmptyBoard = (): BoardState =>
  COLUMNS.reduce((acc, column) => {
    acc[column.id] = [];
    return acc;
  }, {} as BoardState);

const COLUMN_IDS = COLUMNS.map((c) => c.id);

export const isColumnId = (value: string): value is ColumnId =>
  (COLUMN_IDS as readonly string[]).includes(value);

/** Reads board state from localStorage, falling back to an empty board if the
 *  value is missing or unparseable. Only columns we recognize are kept. */
export const loadBoard = (): BoardState => {
  if (typeof localStorage === 'undefined') return createEmptyBoard();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyBoard();

    const parsed = JSON.parse(raw) as Partial<Record<string, KanbanItem[]>>;
    const board = createEmptyBoard();

    for (const key of Object.keys(parsed)) {
      if (isColumnId(key) && Array.isArray(parsed[key])) {
        board[key] = parsed[key];
      }
    }
    return board;
  } catch {
    return createEmptyBoard();
  }
};

export const saveBoard = (board: BoardState): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch {
    // Ignore quota/serialization errors — persistence is best-effort.
  }
};

export const addItem = (
  board: BoardState,
  columnId: ColumnId,
  item: KanbanItem,
): BoardState => ({ ...board, [columnId]: [...board[columnId], item] });

export const removeItem = (board: BoardState, itemId: string): BoardState => {
  const next = { ...board };
  for (const columnId of COLUMN_IDS) {
    next[columnId] = next[columnId].filter((item) => item.id !== itemId);
  }
  return next;
};

/** Returns the column id that currently holds the given item, or null. */
export const findColumnOfItem = (
  board: BoardState,
  itemId: string,
): ColumnId | null => {
  for (const columnId of COLUMN_IDS) {
    if (board[columnId].some((item) => item.id === itemId)) {
      return columnId;
    }
  }
  return null;
};

/** Reorders an item within its column. No-op if indices are out of range. */
export const reorderWithinColumn = (
  board: BoardState,
  columnId: ColumnId,
  fromIndex: number,
  toIndex: number,
): BoardState => {
  const items = board[columnId];
  if (
    fromIndex < 0 ||
    fromIndex >= items.length ||
    toIndex < 0 ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return board;
  }
  const next = items.slice();
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return { ...board, [columnId]: next };
};

/** Moves an item to a target column at a given index, removing it from its
 *  current column. The index is clamped to the destination's bounds. */
export const moveItemToColumn = (
  board: BoardState,
  itemId: string,
  toColumn: ColumnId,
  toIndex: number,
): BoardState => {
  const fromColumn = findColumnOfItem(board, itemId);
  if (!fromColumn) return board;

  const item = board[fromColumn].find((i) => i.id === itemId);
  if (!item) return board;

  const source = board[fromColumn].filter((i) => i.id !== itemId);
  const destItems = toColumn === fromColumn ? source : board[toColumn].slice();
  const index = Math.max(0, Math.min(toIndex, destItems.length));
  destItems.splice(index, 0, item);

  return { ...board, [fromColumn]: source, [toColumn]: destItems };
};
