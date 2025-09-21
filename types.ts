
export enum HighlightType {
  Risky = 'RISKY',
  Payment = 'PAYMENT',
  Deadline = 'DEADLINE',
  Confidentiality = 'CONFIDENTIALITY',
  Normal = 'NORMAL',
}

export interface HighlightedContent {
  text: string;
  type: HighlightType;
}

export interface AnalysisResult {
  riskScore: number;
  riskExplanation: string;
  suggestions: string[];
  highlightedContent: HighlightedContent[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
