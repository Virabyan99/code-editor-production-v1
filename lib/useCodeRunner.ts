import { useCallback, useEffect, useRef } from 'react';
import { useEditorStore, useConsoleStore } from '@/lib/store';

export function useCodeRunner() {
  const { code } = useEditorStore();
  const { addLog } = useConsoleStore();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = document.createElement('iframe');
    iframe.src = '/sandbox.html';
    iframe.style.display = 'none'; // Hide the iframe
    iframe.sandbox = 'allow-scripts'; // Restrict iframe capabilities
    document.body.appendChild(iframe);
    iframeRef.current = iframe;

    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;
      if (type === 'log') {
        addLog(data.join(' '));
      } else if (type === 'warn') {
        addLog(`WARN: ${data.join(' ')}`);
      } else if (type === 'error') {
        addLog(`ERROR: ${data.join(' ')}`);
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
  }, [addLog]);

  const run = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'run', code }, '*');
    }
  }, [code]);

  return { run };
}