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