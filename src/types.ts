/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ComponentData {
  id: string;
  name: string;
  weight: number; // in kg
  x: number; // in mm
  y: number; // in mm
  z: number; // in mm
  category: string;
}

export interface CGResult {
  totalWeight: number;
  cgX: number;
  cgY: number;
  cgZ: number;
}

export interface SpecMatchResult {
  keyword: string;
  milStd: string;
  description: string;
  relevance: number;
  lessonLearned?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
