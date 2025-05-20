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
    id: number;          // issued by the worker
    kind: TimerKind;
    delay: number;       // ≥ 0 ms
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