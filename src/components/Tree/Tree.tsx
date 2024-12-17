import cn from "classnames";
import { useEffect, useCallback } from "react";
import { TreeNodeWithId } from '@/types';
import './tree.css';

interface TreeProps {
  data: TreeNodeWithId[];
  onSelectEntry: (id: string) => void;
  onNodeClick: (id: string) => void;
  activeNodeId: string | null;
}

const Tree = ({ data, onSelectEntry, onNodeClick, activeNodeId }: TreeProps) => {
  return (
    <ul>
      {data.map((node) => (
        <TreeNodeItem
          key={node.elementId}
          node={node}
          onSelectEntry={onSelectEntry}
          onNodeClick={onNodeClick}
          activeNodeId={activeNodeId}
        />
      ))}
    </ul>
  );
};

interface TreeNodeItemProps {
  node: TreeNodeWithId;
  onSelectEntry: (id: string) => void;
  onNodeClick: (id: string) => void;
  activeNodeId: string | null;
}

const TreeNodeItem = ({
  node,
  onSelectEntry,
  onNodeClick,
  activeNodeId,
}: TreeNodeItemProps) => {
  const isActive = activeNodeId === node.elementId;

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onNodeClick(node.elementId);
      if (!node.children && node.id) {
        onSelectEntry(node.id);
      }
    },
    [node, onSelectEntry, onNodeClick]
  );

  return (
    <li
      onClick={handleClick}
      className={cn({ active: isActive })}
    >
      {node.label}
      {node.children && (
        <ul>
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.elementId}
              node={child}
              onSelectEntry={onSelectEntry}
              onNodeClick={onNodeClick}
              activeNodeId={activeNodeId}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Tree;
