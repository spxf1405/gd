export type BracketMatch = {
  id: string;
  round: number;
  matchIndex: number;
  side: "left" | "right";
  players: [string, string];
  winner: string | null;
  isSkipped: boolean;
  isAutoWin: boolean;
  displayOrder: number | null;
  totalRounds: number;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
  };
};
