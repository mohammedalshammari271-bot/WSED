/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PoetryLine {
  first: string;
  second: string;
}

export interface Question {
  id: string;
  sourcePage: number;
  sourceActivityOrder: number;
  sourceItemOrder: number;
  sourceActivityLabel: string;
  sourceType: string;
  year: string;
  type: "poetry" | "quran" | "prose";
  verse?: string;
  poetryLines?: PoetryLine[];
  text: string;
  modelAnswer: string;
}

export interface AppState {
  currentScreen: "home" | "practice" | "results";
  currentIndex: number;
  answers: Record<string, string>;
  shownAnswers: Record<string, boolean>;
  ratings: Record<string, number>;
  mastery: Record<string, "high" | "mid" | "low" | undefined>;
  expandedCards: Record<string, boolean>;
  theme: "light" | "dark";
  filter: "all" | "unanswered" | "unrated" | "needs_review" | "not_mastered" | "mastered";
}
