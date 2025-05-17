// lib/useCodeMirror.ts
import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, placeholder } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands'; // Add this import
import { javascript } from '@codemirror/lang-javascript';
import { useEditorStore } from '@/lib/store';

export default function useCodeMirror() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { code, setCode } = useEditorStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        javascript({ jsx: true, typescript: true }),
        placeholder('type code here'),
        EditorView.theme({
          '&': { fontFamily: 'var(--font-fira-code), monospace', height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
        }),
        keymap.of(defaultKeymap), // Add this line
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const value = update.state.doc.toString();
            setCode(value);
          }
        }),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    view.focus();

    return () => {
      view.destroy();
    };
  }, [containerRef]);

  return containerRef;
}