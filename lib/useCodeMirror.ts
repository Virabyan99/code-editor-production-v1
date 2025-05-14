// lib/useCodeMirror.ts
import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, placeholder } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { useEditorStore } from '@/lib/store';

export default function useCodeMirror() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { code, setCode } = useEditorStore();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize CodeMirror state with extensions
    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),                       // Show line numbers
        javascript({ jsx: true, typescript: true }), // JS support with JSX/TS
        placeholder('type code here'),       // Placeholder when empty
        EditorView.theme({                   // Custom styling
          '&': { fontFamily: 'var(--font-fira-code), monospace', height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
        }),
        // Sync changes to Zustand store
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const value = update.state.doc.toString();
            setCode(value);
          }
        }),
      ],
    });

    // Render the editor
    const view = new EditorView({ state, parent: containerRef.current });

    // Autofocus the editor on mount
    view.focus();

    // Cleanup on unmount
    return () => {
      view.destroy();
    };
  }, [containerRef]);

  return containerRef;
}