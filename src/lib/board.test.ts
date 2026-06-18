import { describe, expect, it } from 'vitest';
import {
  addItem,
  createEmptyBoard,
  findColumnOfItem,
  moveItemToColumn,
  removeItem,
  reorderWithinColumn,
  type BoardState,
} from './board';
import type { KanbanItem } from '../types';

const makeItem = (id: string): KanbanItem => ({
  id,
  title: `Task ${id}`,
  character: {
    id: `c-${id}`,
    name: `Char ${id}`,
    status: 'Alive',
    species: 'Human',
    image: 'https://example.com/avatar.png',
  },
});

const boardWith = (
  todo: string[] = [],
  doing: string[] = [],
  done: string[] = [],
): BoardState => ({
  todo: todo.map(makeItem),
  doing: doing.map(makeItem),
  done: done.map(makeItem),
});

const ids = (items: KanbanItem[]) => items.map((i) => i.id);

describe('createEmptyBoard', () => {
  it('returns all three columns empty', () => {
    expect(createEmptyBoard()).toEqual({ todo: [], doing: [], done: [] });
  });
});

describe('addItem', () => {
  it('appends to the target column without mutating the original', () => {
    const board = createEmptyBoard();
    const next = addItem(board, 'todo', makeItem('a'));

    expect(ids(next.todo)).toEqual(['a']);
    expect(board.todo).toHaveLength(0); // original untouched
  });
});

describe('removeItem', () => {
  it('removes an item regardless of which column it is in', () => {
    const board = boardWith(['a'], ['b'], ['c']);
    const next = removeItem(board, 'b');
    expect(ids(next.doing)).toEqual([]);
    expect(ids(next.todo)).toEqual(['a']);
  });
});

describe('findColumnOfItem', () => {
  it('finds the column holding the item', () => {
    const board = boardWith(['a'], ['b'], []);
    expect(findColumnOfItem(board, 'b')).toBe('doing');
  });

  it('returns null for an unknown item', () => {
    expect(findColumnOfItem(createEmptyBoard(), 'nope')).toBeNull();
  });
});

describe('reorderWithinColumn', () => {
  it('moves an item to a new index within the column', () => {
    const board = boardWith(['a', 'b', 'c']);
    const next = reorderWithinColumn(board, 'todo', 0, 2);
    expect(ids(next.todo)).toEqual(['b', 'c', 'a']);
  });

  it('is a no-op for out-of-range or identical indices', () => {
    const board = boardWith(['a', 'b']);
    expect(reorderWithinColumn(board, 'todo', 0, 0)).toBe(board);
    expect(reorderWithinColumn(board, 'todo', 5, 1)).toBe(board);
  });
});

describe('moveItemToColumn', () => {
  it('moves an item to another column at the given index', () => {
    const board = boardWith(['a'], ['x', 'y'], []);
    const next = moveItemToColumn(board, 'a', 'doing', 1);
    expect(ids(next.todo)).toEqual([]);
    expect(ids(next.doing)).toEqual(['x', 'a', 'y']);
  });

  it('clamps an out-of-range index to the end of the destination', () => {
    const board = boardWith(['a'], ['x'], []);
    const next = moveItemToColumn(board, 'a', 'doing', 99);
    expect(ids(next.doing)).toEqual(['x', 'a']);
  });

  it('returns the board unchanged for an unknown item', () => {
    const board = boardWith(['a']);
    expect(moveItemToColumn(board, 'ghost', 'done', 0)).toBe(board);
  });
});
