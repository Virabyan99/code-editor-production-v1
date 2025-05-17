// components/EditorPane.tsx
'use client';

import useCodeMirror from '@/lib/useCodeMirror';

export default function EditorPane() {
  const editorRef = useCodeMirror();

  return (
    <section
      ref={editorRef}
      className="h-[91vh] w-full overflow-x-auto overflow-y-auto focus:outline-none"
    />
  );
}