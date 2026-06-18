import { useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { COLUMNS } from '../../constants';
import { useBoard } from '../../hooks/useBoard';
import {
  findColumnOfItem,
  isColumnId,
  moveItemToColumn,
  reorderWithinColumn,
} from '../../lib/board';
import type { ColumnId } from '../../constants';
import type { KanbanItem } from '../../types';
import { celebrate } from '../../utils/celebrate';
import { AddItemForm } from '../AddItemForm/AddItemForm';
import { Card } from '../Card/Card';
import { SortableCard } from '../Card/SortableCard';
import { Column } from '../Column/Column';
import styles from './Board.module.css';

export const Board = () => {
  const { board, setBoard, addItem, removeItem } = useBoard();
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null);
  // Column the active card started in, so we only celebrate a *new* arrival.
  const dragOriginColumn = useRef<ColumnId | null>(null);

  const sensors = useSensors(
    // A small activation distance lets click handlers (e.g. delete) still fire.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    const column = findColumnOfItem(board, id);
    if (!column) return;
    dragOriginColumn.current = column;
    setActiveItem(board[column].find((item) => item.id === id) ?? null);
  };

  /** Relocate across columns mid-drag so the card visually follows the cursor. */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const fromColumn = findColumnOfItem(board, activeId);
    const toColumn = isColumnId(overId) ? overId : findColumnOfItem(board, overId);
    if (!fromColumn || !toColumn || fromColumn === toColumn) return;

    setBoard((prev) => {
      const overItems = prev[toColumn];

      // Dropped onto the column body (not a card) → append to the end.
      let newIndex = overItems.length;
      if (!isColumnId(overId)) {
        const overIndex = overItems.findIndex((item) => item.id === overId);
        if (overIndex !== -1) {
          // Insert below the hovered card if the cursor is past its midpoint.
          const overRect = over.rect;
          const pointerBelow =
            active.rect.current.translated &&
            active.rect.current.translated.top >
              overRect.top + overRect.height / 2;
          newIndex = pointerBelow ? overIndex + 1 : overIndex;
        }
      }

      return moveItemToColumn(prev, activeId, toColumn, newIndex);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const column = findColumnOfItem(board, activeId);
    if (!column) return;

    // Delight: celebrate a task arriving in Done from another column.
    const origin = dragOriginColumn.current;
    dragOriginColumn.current = null;
    if (column === 'done' && origin !== 'done') {
      celebrate();
    }

    // Cross-column moves are already applied in handleDragOver; here we only
    // need to settle the order within the destination column.
    if (!isColumnId(overId) && overId !== activeId) {
      const fromIndex = board[column].findIndex((item) => item.id === activeId);
      const toIndex = board[column].findIndex((item) => item.id === overId);
      if (fromIndex !== -1 && toIndex !== -1) {
        setBoard((prev) => reorderWithinColumn(prev, column, fromIndex, toIndex));
      }
    }
  };

  return (
    <>
      <AddItemForm onAdd={(item) => addItem('todo', item)} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActiveItem(null);
          dragOriginColumn.current = null;
        }}
      >
        <div className={styles.board}>
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              itemIds={board[column.id].map((item) => item.id)}
            >
              {board[column.id].map((item) => (
                <SortableCard key={item.id} item={item} onDelete={removeItem} />
              ))}
            </Column>
          ))}
        </div>

        <DragOverlay>
          {activeItem ? <Card item={activeItem} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};
