import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, placeholder } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { useEditorStore } from '@/lib/store';
import { fadeInExtension, addFadeIn } from '@/hooks/fadeInExtension';

export default function useCodeMirror() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
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
          '&': {
            fontFamily: 'var(--font-fira-code), monospace',
            height: '100%',
            fontSize: '13px',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
          },
          '.cm-content': {
            color: 'var(--foreground)',
          },
          '.cm-line': {
            lineHeight: '1.4em',
          },
          '.cm-scroller': { overflow: 'auto' },
          '.cm-gutters': {
            backgroundColor: 'var(--gutter-background)',
            color: 'var(--gutter-foreground)',
            borderRight: 'none',
          },
          '.cm-lineNumbers .cm-gutterElement': {
            color: 'var(--gutter-foreground)',
            fontFamily: 'var(--font-fira-code), monospace',
            fontSize: '13px',
          },
          '.cm-cursor': {
            borderLeft: '1px solid var(--foreground)', // Fixed cursor styling
          },
        }),
        keymap.of(defaultKeymap),
        fadeInExtension,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const value = update.state.doc.toString();
            setCode(value);
          }
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const changes = [];
            update.changes.iterChanges((fromA, toA, fromB, toB) => {
              if (fromB !== toB) {
                changes.push({ from: fromB, to: toB });
              }
            });
            if (changes.length > 0) {
              update.view.dispatch({
                effects: changes.map((change) => addFadeIn.of(change)),
              });
            }
          }
        }),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;
    view.focus();

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [containerRef]);

  useEffect(() => {
    const view = viewRef.current;
    if (view && code !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: code },
      });
    }
  }, [code]);

  return containerRef;
}