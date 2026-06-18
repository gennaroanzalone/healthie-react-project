import { useCallback, useEffect, useRef, useState } from 'react';
import type { ColumnId } from '../constants';
import type { KanbanItem } from '../types';
import * as board from '../lib/board';
import type { BoardState } from '../lib/board';

export const useBoard = () => {
  const [state, setState] = useState<BoardState>(board.loadBoard);

  // Skip persisting the very first render — it's identical to what we loaded.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    board.saveBoard(state);
  }, [state]);

  const addItem = useCallback((columnId: ColumnId, item: KanbanItem) => {
    setState((prev) => board.addItem(prev, columnId, item));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setState((prev) => board.removeItem(prev, itemId));
  }, []);

  return { board: state, setBoard: setState, addItem, removeItem };
};
