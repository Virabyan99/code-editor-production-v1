// lib/useCodeMirror.ts
import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, placeholder } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { useEditorStore } from '@/lib/store';

export default function useCodeMirror() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null); // Store the EditorView instance
  const { code, setCode } = useEditorStore();

  // Initialize the editor once
  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: code, // Start with initial code
      extensions: [
        lineNumbers(),
        javascript({ jsx: true, typescript: true }),
        placeholder('type code here'),
        EditorView.theme({
          '&': {
            fontFamily: 'var(--font-fira-code), monospace',
            height: '100%',
            fontSize: '13px',
          },
          '.cm-line': {
            lineHeight: '1.4em',
          },
          '.cm-scroller': { overflow: 'auto' },
        }),
        keymap.of(defaultKeymap),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const value = update.state.doc.toString();
            setCode(value);
          }
        }),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view; // Save the view instance
    view.focus();

    // Cleanup on unmount
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [containerRef]); // Only run once when containerRef is ready

  // Sync external code changes into the editor
  useEffect(() => {
    const view = viewRef.current;
    if (view && code !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: code },
      });
    }
  }, [code]); // Run when code changes externally

  return containerRef;
}