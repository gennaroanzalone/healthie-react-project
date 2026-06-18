export interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  image: string;
}

export interface KanbanItem {
  id: string; // crypto.randomUUID()
  title: string;
  character: Character;
}
