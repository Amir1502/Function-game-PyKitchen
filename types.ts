export enum IngredientType {
  INTEGER = 'int',
  STRING = 'str',
  LIST = 'list',
  BOOLEAN = 'bool',
  DICT = 'dict'
}

export interface Ingredient {
  id: string;
  name: string; // The variable name e.g., 'apple_count'
  value: any;   // The actual value e.g., 5
  displayValue: string; // The visual representation e.g., "5"
  type: IngredientType;
  description: string;
}

export interface ToolArgument {
  name: string;
  allowedTypes: IngredientType[];
}

export interface Tool {
  id: string;
  name: string; // e.g., 'sum'
  description: string;
  signature: string; // e.g., 'sum(iterable)'
  args: ToolArgument[];
  execute: (...args: any[]) => any;
  pythonDoc: string; // For the tooltip
}

export enum Difficulty {
  EASY = 'ЛЕГКО',
  MEDIUM = 'СРЕДНЕ',
  HARD = 'СЛОЖНО'
}

export interface Order {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  expectedResult: any;
  hint: string; // Static hint
  learningGoal: string; // Educational explanation
  requiredToolId?: string; // If specific tool needed
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'error' | 'success' | 'ai';
  message: string;
}