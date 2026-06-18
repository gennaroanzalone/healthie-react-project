import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { KanbanItem } from '../../types';
import { Card } from './Card';
import styles from './SortableCard.module.css';

interface SortableCardProps {
  item: KanbanItem;
  onDelete: (itemId: string) => void;
}

export const SortableCard = ({ item, onDelete }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.wrapper} ${isDragging ? styles.dragging : ''}`}
      {...attributes}
      {...listeners}
    >
      <Card item={item} onDelete={onDelete} />
    </div>
  );
};
