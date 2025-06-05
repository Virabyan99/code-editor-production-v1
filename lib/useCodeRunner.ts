// lib/useCodeRunner.ts
import { useCallback, useEffect, useRef } from 'react';
import { useEditorStore } from '@/lib/store';
import { transformPrompt } from '@/lib/transformPrompt';
import { transformForEvaluation } from './transformForEvaluation';

export function useCodeRunner() {
  const { code } = useEditorStore();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = document.createElement('iframe');
    iframe.id = 'sandbox-iframe';
    iframe.src = '/sandbox.html';
    iframe.style.display = 'none';
    iframe.sandbox = 'allow-scripts';
    document.body.appendChild(iframe);
    iframeRef.current = iframe;

    return () => {
      if (iframeRef.current) document.body.removeChild(iframeRef.current);
    };
  }, []);

  const run = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    let transformed = transformPrompt(code);
    transformed = transformForEvaluation(transformed);
    iframeRef.current.contentWindow.postMessage({ type: 'run', code: transformed }, '*');
  }, [code]);

  return { run };
}