export interface TargetScore {
  transmission: number;
  transaction: number;
  preparation: number;
  relationship: number;
  timing: number;
}

export interface Target {
  id: string;
  name: string;
  sector: string;
  priorityScore: number;
  signals: string[];
  dealType: string;
  timeframe: string;
  accessibility: string;
  scores: TargetScore;
}

export interface SearchResult {
  id: string;
  name: string;
  sector: string;
  type: "page" | "target";
  path: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  timestamp: string; // ISO string for easier serialization
}
