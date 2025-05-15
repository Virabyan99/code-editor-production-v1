import { useCallback, useEffect, useRef } from 'react';
import { useEditorStore, useConsoleStore } from '@/lib/store';

export function useCodeRunner() {
  const { code } = useEditorStore();
  const { addLog, clear } = useConsoleStore();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = document.createElement('iframe');
    iframe.src = '/sandbox.html';
    iframe.style.display = 'none';
    iframe.sandbox = 'allow-scripts';
    document.body.appendChild(iframe);
    iframeRef.current = iframe;

    const handleMessage = (event: MessageEvent) => {
      const { type, data, payload } = event.data;
      if (type === 'log') {
        addLog(payload);
      } else if (type === 'warn') {
        addLog(`WARN: ${data.join(' ')}`);
      } else if (type === 'error') {
        addLog(`ERROR: ${data.join(' ')}`);
      } else if (type === 'clear') {
        clear();
      } else if (type === 'done') {
        // Optionally handle completion
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (iframeRef.current) {
        document.body.removeChild(iframeRef.current);
      }
    };
  }, [addLog, clear]);

  const run = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'run', code }, '*');
    }
  }, [code]);

  return { run };
}