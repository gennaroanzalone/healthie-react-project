import type { KanbanItem } from '../../types';
import styles from './Card.module.css';

interface CardProps {
  item: KanbanItem;
  onDelete?: (itemId: string) => void;
  /** Visual-only flag for the drag overlay clone. */
  isOverlay?: boolean;
}

const statusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'alive':
      return 'var(--status-alive)';
    case 'dead':
      return 'var(--status-dead)';
    default:
      return 'var(--status-unknown)';
  }
};

export const Card = ({ item, onDelete, isOverlay = false }: CardProps) => {
  const { character } = item;

  return (
    <article className={`${styles.card} ${isOverlay ? styles.overlay : ''}`}>
      <img
        className={styles.avatar}
        src={character.image}
        alt={character.name}
        loading="lazy"
        draggable={false}
      />
      <div className={styles.body}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.character}>
          <span
            className={styles.statusDot}
            style={{ background: statusColor(character.status) }}
            title={character.status}
          />
          {character.name}
          <span className={styles.species}> · {character.species}</span>
        </p>
      </div>
      {onDelete && (
        <button
          type="button"
          className={styles.delete}
          aria-label={`Delete ${item.title}`}
          onClick={() => onDelete(item.id)}
          onPointerDown={(e) => e.stopPropagation()}
        >
          ×
        </button>
      )}
    </article>
  );
};
