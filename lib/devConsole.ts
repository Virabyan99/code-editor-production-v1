import { useConsoleStore } from '@/lib/store';

export const devLog = (msg: string) => {
  useConsoleStore.getState().addLog(msg);
};