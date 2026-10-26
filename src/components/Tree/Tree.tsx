import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { TreeNodeWithId, DragPosition, TreeNode } from '@/types';
import { addUniqueIds, findNode } from '@/utils';
import { moveNode, type MoveDirection } from '@/utils/moveNode';
import { useFetch } from '@/hooks/useFetch';
import { fetchTreeData } from '@/api';
import TreeNodeItem from '@/components/TreeNodeItem';
import {
  handleDragStart,
  handleDragMove,
  handleDragEnd,
} from './treeDragHandlers';
import './tree.css';

interface TreeProps {
  onSelectEntry: (id: string | null) => void;
}

const Tree = ({ onSelectEntry }: TreeProps) => {
  const { data, loading, error } = useFetch<TreeNode[]>(fetchTreeData);
  const [treeData, setTreeData] = useState<TreeNodeWithId[]>([]);
  const [draggedNode, setDraggedNode] = useState<TreeNodeWithId | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<DragPosition>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setTreeData(addUniqueIds(data));
    }
  }, [data]);

  const onNodeClick = (id: string) => {
    setActiveNodeId(id);
    const [node] = findNode(treeData, id);
    onSelectEntry(node?.id && !node.children?.length ? node.id : null);
  };

  const onDragStart = (event: DragStartEvent) => {
    handleDragStart(event, treeData, setDraggedNode);
  };

  const onDragMove = (event: DragOverEvent) => {
    handleDragMove(event, overId, dragPosition, setOverId, setDragPosition);
  };

  const onDragEnd = (event: DragEndEvent) => {
    handleDragEnd(
      event,
      treeData,
      setDraggedNode,
      setTreeData,
      setOverId,
      dragPosition,
      setDragPosition,
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!treeData || treeData.length === 0) return <div>No data available</div>;

  const selected = activeNodeId ? findNode(treeData, activeNodeId)[0] : null;

  return (
    <>
      <div className="tree-toolbar" aria-label="Move selected item">
        {(
          [
            ['up', 'Move up'],
            ['down', 'Move down'],
            ['indent', 'Indent'],
            ['outdent', 'Outdent'],
          ] as [MoveDirection, string][]
        ).map(([direction, label]) => (
          <button
            key={direction}
            disabled={
              !selected ||
              moveNode(treeData, selected.elementId, direction) === treeData
            }
            onClick={() =>
              selected &&
              setTreeData(moveNode(treeData, selected.elementId, direction))
            }
          >
            {label}
          </button>
        ))}
      </div>
      <p className="selection-note" aria-live="polite">
        {selected
          ? `Selected: ${selected.label}`
          : 'Select an item to move it or view its details.'}
      </p>
      <DndContext
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragCancel={() => {
          setDraggedNode(null);
          setOverId(null);
          setDragPosition(null);
        }}
      >
        <ul className="tree-root">
          {treeData.map((node) => (
            <TreeNodeItem
              key={node.elementId}
              node={node}
              onSelectEntry={onSelectEntry}
              onNodeClick={onNodeClick}
              activeNodeId={activeNodeId}
              overId={overId}
              dragPosition={dragPosition}
            />
          ))}
        </ul>
        <DragOverlay>
          {draggedNode ? (
            <div className="tree-dragged-item">{draggedNode.label}</div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default Tree;
