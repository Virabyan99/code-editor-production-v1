import { useCallback, useEffect, useRef } from 'react';
import { useEditorStore } from '@/lib/store';
import { transformPrompt } from '@/lib/transformPrompt';
import { transformForEvaluation } from './transformForEvaluation';
import { useConsoleStore } from './consoleStore';

export function useCodeRunner() {
  const { code } = useEditorStore();
  const { clear, isOverwrite } = useConsoleStore(); // Added clear and isOverwrite
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
    if (isOverwrite) {
      clear(); // Clear console if overwrite is true
    }
    if (!iframeRef.current?.contentWindow) return;
    let transformed = transformPrompt(code);
    transformed = transformForEvaluation(transformed);
    iframeRef.current.contentWindow.postMessage({ type: 'run', code: transformed }, '*');
  }, [code, isOverwrite, clear]); // Added isOverwrite and clear to dependencies

  return { run };
}