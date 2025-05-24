'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useDialogStore } from '@/lib/dialogStore';
import { useEffect, useState } from 'react';
import type { DialogRequest } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function DialogHost() {
  const [current, setCurrent] = useState<DialogRequest | null>(null);
  const shift = useDialogStore((s) => s.shift);
  const queueLength = useDialogStore((s) => s.queue.length);
  const [promptValue, setPromptValue] = useState(''); // Added for controlled input

  useEffect(() => {
    if (!current && queueLength > 0) {
      const next = shift();
      if (next) {
        setCurrent(next);
        if (next.kind === 'prompt') {
          setPromptValue(next.defaultValue ?? ''); // Initialize prompt value
        }
      }
    }
  }, [current, shift, queueLength]);

  const resolve = (value: string | boolean | null) => {
    if (!current) return;
    const response = { requestId: current.requestId, result: value };
    const iframe = document.getElementById('sandbox-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'dialogResult', payload: response }, '*');
    }
    setCurrent(null);
  };

  if (!current) return null;

  switch (current.kind) {
    case 'alert':
      return (
        <AlertDialog open onOpenChange={() => resolve(null)}>
          <AlertDialogContent>
            <AlertDialogTitle>Alert</AlertDialogTitle>
            <AlertDialogDescription>{current.message}</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => resolve(null)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    case 'confirm':
      return (
        <Dialog open>
          <DialogContent>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>{current.message}</DialogDescription>
            <DialogFooter>
              <Button onClick={() => resolve(false)}>Cancel</Button>
              <Button onClick={() => resolve(true)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    case 'prompt':
      return (
        <Dialog open>
          <DialogContent>
            <DialogTitle>Input Required</DialogTitle>
            <DialogDescription>{current.message}</DialogDescription>
            <Input
              id="prompt"
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)} // Controlled input
            />
            <DialogFooter>
              <Button onClick={() => resolve(null)}>Cancel</Button>
              <Button onClick={() => resolve(promptValue)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
  }
}