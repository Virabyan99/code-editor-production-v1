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
  | 'clear'
  | 'debug'
  | 'count'
  | 'timeLog'
  | 'timeEnd'
  | 'group'
  | 'groupCollapsed'
  | 'groupEnd';

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
    args?: unknown[];
    stack?: string;
    tableMeta?: TableMeta;
    label?: string;      // For count, timeLog, timeEnd, group
    value?: number;      // For count
    elapsed?: number;    // For timeLog, timeEnd
    extra?: string[];    // For timeLog, timeEnd
    depth?: number;      // For all messages, especially groups
    objectId?: number;   // For dir
    snapshot?: ObjSnapshot; // For dir
  };
}

// Lesson 8: Object Explorer types
export interface ObjSnapshot {
  type: string;
  preview: string;
  keys?: string[];
  length?: number;
  value?: string | number | boolean | null;
  id?: number | null; // Add id to track object identity
}

export interface ObjExpandReq {
  type: 'objExpand';
  payload: { objectId: number; path: (string | number)[] };
}

export interface ObjExpandRes {
  type: 'objExpandRes';
  payload: { objectId: number; path: (string | number)[]; snapshot: ObjSnapshot };
}