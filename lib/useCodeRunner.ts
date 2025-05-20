// lib/useCodeRunner.ts
import { useCallback, useEffect, useRef } from 'react';
import { useEditorStore } from '@/lib/store';

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
      if (iframeRef.current) {
        document.body.removeChild(iframeRef.current);
      }
    };
  }, []);

  const run = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'run', code }, '*');
    }
  }, [code]);

  return { run };
}