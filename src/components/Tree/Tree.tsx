import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { TreeNodeWithId, DragPosition, TreeNode } from '@/types';
import TreeNodeItem from '@/components/TreeNodeItem';
import './tree.css';
import {
  addUniqueIds,
  removeNode,
  insertNode,
  isDescendant,
  insertNodeAsSibling,
} from '@/utils';
import { useFetch } from '@/hooks/useFetch';
import { fetchTreeData } from '@/api';

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const stack = [...treeData];
    let found: TreeNodeWithId | null = null;

    while (stack.length) {
      const node = stack.pop()!;
      if (node.elementId === active.id) {
        found = node;
        break;
      }
      if (node.children) {
        stack.push(...node.children);
      }
    }
    setDraggedNode(found);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over, activatorEvent } = event;
    if (!over) {
      if (overId !== null) setOverId(null);
      if (dragPosition !== null) setDragPosition(null);
      return null;
    }

    const newOverId = over.id.toString();
    let newDragPosition: DragPosition = null;

    const droppableElement = document.querySelector(`[data-id="${over.id}"]`);
    if (droppableElement && activatorEvent instanceof MouseEvent) {
      const rect = droppableElement.getBoundingClientRect();
      const y = activatorEvent.clientY - rect.top;
      const insideKeyPressed = activatorEvent.ctrlKey || activatorEvent.metaKey; 
      newDragPosition = insideKeyPressed 
        ? 'inside' 
        : (y < rect.height / 2 ? 'above' : 'below');
    }

    if (newOverId !== overId) setOverId(newOverId);
    if (newDragPosition !== dragPosition) setDragPosition(newDragPosition);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedNode(null);
    const currentDragPosition = dragPosition;
    setOverId(null);
    setDragPosition(null);

    if (!over) {
      return null;
    }

    const draggedNodeId = active.id as string;
    const targetNodeId = over.id as string;

    if (draggedNodeId === targetNodeId || isDescendant(treeData, draggedNodeId, targetNodeId)) {
      return null;
    }

    const [removedNode, newTreeWithoutDragged] = removeNode(treeData, draggedNodeId);
    if (!removedNode) return;

    let updatedTree: TreeNodeWithId[] | null = null;

    if (currentDragPosition === 'inside') {
      updatedTree = insertNode(newTreeWithoutDragged, targetNodeId, removedNode);
    } else if (currentDragPosition === 'above' || currentDragPosition === 'below') {
      updatedTree = insertNodeAsSibling(newTreeWithoutDragged, targetNodeId, removedNode, currentDragPosition);
    }

    if (!updatedTree) return;

    setTreeData(updatedTree);
    console.log('Updated Tree:', JSON.stringify(updatedTree, null, 2));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!treeData || treeData.length === 0) return <div>No data available</div>;

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
