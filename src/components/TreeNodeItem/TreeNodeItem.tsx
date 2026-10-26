import React, { MouseEvent } from 'react';
import cn from 'classnames';
import { TreeNodeWithId, DragPosition } from '@/types';
import { useDraggable, useDroppable } from '@dnd-kit/core';

interface TreeNodeItemProps {
  node: TreeNodeWithId;
  onSelectEntry: (id: string | null) => void;
  onNodeClick: (id: string) => void;
  activeNodeId: string | null;
  overId: string | null;
  dragPosition: DragPosition;
}

const TreeNodeItem = ({
  node,
  onSelectEntry,
  onNodeClick,
  activeNodeId,
  overId,
  dragPosition,
}: TreeNodeItemProps) => {
  const isActive = activeNodeId === node.elementId;

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: node.elementId,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
  } = useDraggable({
    id: node.elementId,
  });

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    onNodeClick(node.elementId);
  };

  const highlightClass =
    overId === node.elementId && dragPosition ? `drop-${dragPosition}` : '';

  return (
    <li
      data-id={node.elementId}
      ref={setDroppableRef}
      className={cn('tree-item', highlightClass, { active: isActive })}
    >
      <div className="tree-item-content">
        <button
          ref={setDraggableRef}
          {...attributes}
          {...listeners}
          className="drag-handle"
          aria-label={`Drag ${node.label}`}
          type="button"
          onClick={(e) => e.stopPropagation()}
        >
          ⠿
        </button>
        <button
          type="button"
          className="tree-item-label"
          aria-pressed={isActive}
          onClick={handleClick}
        >
          {node.label}
        </button>
      </div>
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.elementId}
              node={child}
              onSelectEntry={onSelectEntry}
              onNodeClick={onNodeClick}
              activeNodeId={activeNodeId}
              overId={overId}
              dragPosition={dragPosition}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default React.memo(TreeNodeItem);
