import { useState, type FormEvent } from 'react';
import { useCharacters } from '../../hooks/useCharacters';
import type { KanbanItem } from '../../types';
import styles from './AddItemForm.module.css';

interface AddItemFormProps {
  onAdd: (item: KanbanItem) => void;
}

export const AddItemForm = ({ onAdd }: AddItemFormProps) => {
  const { characters, isLoading, error } = useCharacters();
  const [title, setTitle] = useState('');
  const [characterId, setCharacterId] = useState('');

  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle.length > 0 && characterId !== '';

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const character = characters.find((c) => c.id === characterId);
    if (!character) return;

    const item: KanbanItem = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      character,
    };

    onAdd(item);
    setTitle('');
    setCharacterId('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="task-title">
          Task
        </label>
        <input
          id="task-title"
          className={styles.input}
          type="text"
          placeholder="e.g. Stabilize the portal gun"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="task-character">
          Character
        </label>
        <select
          id="task-character"
          className={styles.input}
          value={characterId}
          onChange={(e) => setCharacterId(e.target.value)}
          disabled={isLoading || error !== null}
        >
          <option value="" disabled>
            {isLoading
              ? 'Loading characters…'
              : error
                ? 'Unavailable'
                : 'Select a character'}
          </option>
          {characters.map((character) => (
            <option key={character.id} value={character.id}>
              {character.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className={styles.submit} disabled={!canSubmit}>
        Add task
      </button>

      {error && (
        <p className={styles.error} role="alert">
          Couldn’t load characters: {error}
        </p>
      )}
    </form>
  );
};
