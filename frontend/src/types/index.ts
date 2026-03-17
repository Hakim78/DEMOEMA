export interface Signal {
  id: string;
  label: string;
  family: string;
}

export interface TargetAnalysis {
  type: string;
  window: string;
  narrative: string;
}

export interface Activation {
  deciders: string[];
  approach: string;
  reason: string;
}

export interface Risks {
  falsePositive: string;
  uncertainties: string;
}

export interface Target {
  id: string;
  name: string;
  sector: string;
  globalScore: number;
  priorityLevel: string;
  topSignals: Signal[];
  analysis: TargetAnalysis;
  activation: Activation;
  risks: Risks;
  scores: Record<string, number>;
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
  timestamp: string;
}
