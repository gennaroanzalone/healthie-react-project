import type { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { ColumnId } from '../../constants';
import styles from './Column.module.css';

interface ColumnProps {
  id: ColumnId;
  title: string;
  itemIds: string[];
  children: ReactNode;
}

export const Column = ({ id, title, itemIds, children }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const isEmpty = itemIds.length === 0;

  return (
    <section className={styles.column} aria-label={title}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.count}>{itemIds.length}</span>
      </header>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`${styles.list} ${isOver ? styles.over : ''}`}
        >
          {isEmpty ? <p className={styles.empty}>Drop a task here</p> : children}
        </div>
      </SortableContext>
    </section>
  );
};
