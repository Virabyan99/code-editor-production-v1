// lib/types.ts
export type DialogKind = 'alert' | 'prompt' | 'confirm';

export interface DialogRequest {
  kind: DialogKind;
  message: string;
  defaultValue?: string;
  requestId: string;
}

export interface DialogResponse {
  requestId: string;
  result: string | boolean | null;
}

// Timer types
export type TimerKind = 'timeout' | 'interval';

export interface TimerSet {
  type: 'timerSet';
  payload: {
    id: number;
    kind: TimerKind;
    delay: number;
  };
}

export interface TimerClear {
  type: 'timerClear';
  payload: { id: number };
}

export interface TimerFire {
  type: 'timerFire';
  payload: { id: number };
}

// New log types for Lesson 6
export type LogLevel =
  | 'log'
  | 'info'
  | 'warn'
  | 'error'
  | 'trace'
  | 'assert'
  | 'dir'
  | 'table'
  | 'clear';

export interface TableMeta {
  columns: string[];
  rows: unknown[][];
  caption?: string;
  truncated: boolean;
}

export interface LogMessage {
  type: 'log';
  payload: {
    level: LogLevel;
    args: unknown[];
    stack?: string;
    tableMeta?: TableMeta;
  };
}