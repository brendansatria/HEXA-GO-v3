export interface Team {
  name: string;
  textColor: string;
  bgColor: string;
}

export const TEAMS: Team[] = [
  { name: 'Team 1', textColor: 'text-red-500/70', bgColor: 'bg-red-500' },
  { name: 'Team 2', textColor: 'text-green-500/70', bgColor: 'bg-green-500' },
  { name: 'Team 3', textColor: 'text-blue-500/70', bgColor: 'bg-blue-500' },
  { name: 'Team 4', textColor: 'text-yellow-500/70', bgColor: 'bg-yellow-500' },
];