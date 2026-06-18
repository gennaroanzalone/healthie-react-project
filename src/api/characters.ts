import type { Character } from '../types';

const ENDPOINT = 'https://rickandmortyapi.com/graphql';

/** Number of pages to load up front (20 characters/page). Enough to pick from
 *  without paging through all 826. */
const PAGES_TO_LOAD = 2;

const QUERY = `
  query Characters($page: Int!) {
    characters(page: $page) {
      results {
        id
        name
        status
        species
        image
      }
    }
  }
`;

interface GraphQLResponse {
  data?: {
    characters: {
      results: Character[];
    };
  };
  errors?: { message: string }[];
}

const fetchPage = async (
  page: number,
  signal?: AbortSignal,
): Promise<Character[]> => {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { page } }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to load characters (HTTP ${response.status})`);
  }

  const payload = (await response.json()) as GraphQLResponse;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join('; '));
  }

  if (!payload.data) {
    throw new Error('Malformed response from character API');
  }

  return payload.data.characters.results;
};

export const fetchCharacters = async (
  signal?: AbortSignal,
): Promise<Character[]> => {
  const pages = Array.from({ length: PAGES_TO_LOAD }, (_, i) => i + 1);
  const results = await Promise.all(pages.map((page) => fetchPage(page, signal)));
  return results.flat();
};
