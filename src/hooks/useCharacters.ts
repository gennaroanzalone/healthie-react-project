import { useEffect, useState } from 'react';
import { fetchCharacters } from '../api/characters';
import type { Character } from '../types';

interface UseCharactersResult {
  characters: Character[];
  isLoading: boolean;
  error: string | null;
}

export const useCharacters = (): UseCharactersResult => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchCharacters(controller.signal)
      .then((data) => {
        setCharacters(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Failed to load characters');
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { characters, isLoading, error };
};
