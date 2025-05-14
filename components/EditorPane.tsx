// components/EditorPane.tsx
'use client';

import useCodeMirror from '@/lib/useCodeMirror';

export default function EditorPane() {
  const editorRef = useCodeMirror();

  return (
    <section
      ref={editorRef}
      className="h-full w-full overflow-x-hidden bg-white focus:outline-none"
    />
  );
}