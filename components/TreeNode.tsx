import { useState } from 'react';
import { useExplorer } from '@/lib/objectExplorer';
import { ObjSnapshot } from '@/lib/types';

interface TreeNodeProps {
  nodeId: number;
  path: (string | number)[];
  snapshot: ObjSnapshot;
  ancestorIds: Set<number>;
}

export function TreeNode({ nodeId, path, snapshot, ancestorIds }: TreeNodeProps) {
  const [open, setOpen] = useState(false);
  const { cache } = useExplorer();
  const node = cache[nodeId.toString()];

  const onToggle = () => {
    if (!open && snapshot.keys?.length) {
      const iframe = document.getElementById('sandbox-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        snapshot.keys.forEach((key) => {
          const childPath = [...path, key];
          iframe.contentWindow.postMessage({
            type: 'objExpand',
            payload: { objectId: nodeId, path: childPath },
          }, '*');
        });
      }
    }
    setOpen(!open);
  };

  const isRoot = path.length === 0;
  const lastKey = path.slice(-1)[0];

  return (
    <div className="pl-4">
      {snapshot.keys ? (
        <button onClick={onToggle}>{open ? '▼' : '▶'}</button>
      ) : null}
      {!isRoot && (
        <span className="font-mono">
          {Array.isArray(lastKey) ? `[${lastKey}]` : String(lastKey)}
        </span>
      )}
      <span>{!isRoot ? ': ' : ''}{snapshot.preview ?? String(snapshot.value)}</span>
      {open && snapshot.keys?.map((key) => {
        const childPath = [...path, key];
        const childNode = node?.children?.[key];
        if (childNode && childNode.snapshot.id !== null && ancestorIds.has(childNode.snapshot.id)) {
          return (
            <div key={key} className="pl-4">
              {key}: [Circular]
            </div>
          );
        }
        const newAncestorIds = new Set(ancestorIds);
        if (childNode?.snapshot.id !== null && childNode?.snapshot.id !== undefined) {
          newAncestorIds.add(childNode.snapshot.id);
        }
        return childNode ? (
          childNode.snapshot.keys ? (
            <TreeNode
              key={key}
              nodeId={nodeId}
              path={childPath}
              snapshot={childNode.snapshot}
              ancestorIds={newAncestorIds}
            />
          ) : (
            <div key={key} className="pl-4">
              {key}: {childNode.snapshot.value ?? childNode.snapshot.preview}
            </div>
          )
        ) : (
          <div key={key} className="pl-4">{key}: Loading...</div>
        );
      })}
    </div>
  );
}