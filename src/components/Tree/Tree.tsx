import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { TreeNodeWithId, DragPosition, TreeNode } from '@/types';
import { addUniqueIds } from '@/utils';
import { useFetch } from '@/hooks/useFetch';
import { fetchTreeData } from '@/api';
import TreeNodeItem from '@/components/TreeNodeItem';
import { handleDragStart, handleDragOver, handleDragEnd } from './treeDragHandlers';
import './tree.css';

interface TreeProps {
  onSelectEntry: (id: string) => void;
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
    setActiveNodeId((prev) => (prev === id ? null : id));
  };

  const onDragStart = (event: DragStartEvent) => { 
    handleDragStart(event, treeData, setDraggedNode);
  }

  const onDragOver = (event: DragOverEvent) => {
    handleDragOver(event, overId, dragPosition, setOverId, setDragPosition);
  }

  const onDragEnd = (event: DragEndEvent) => {
    handleDragEnd(event, treeData, setDraggedNode, setTreeData, setOverId, dragPosition, setDragPosition);
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!treeData || treeData.length === 0) return <div>No data available</div>;

  return (
    <DndContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
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
          <div className="tree-dragged-item">
            {draggedNode.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Tree;
