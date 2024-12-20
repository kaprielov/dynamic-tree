import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { TreeNodeWithId, DragPosition } from '@/types';

import {
  removeNode,
  insertNode,
  isDescendant,
  insertNodeAsSibling,
} from '@/utils';

export const handleDragStart = (
  event: DragStartEvent,
  treeData: TreeNodeWithId[],
  setDraggedNode: (found: TreeNodeWithId | null) => void
) => {
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

export const handleDragOver = (
  event: DragOverEvent,
  overId: string | null,
  dragPosition: DragPosition,
  setOverId: (id: string | null) => void,
  setDragPosition: (position: DragPosition) => void
) => {
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

export const handleDragEnd = (
  event: DragEndEvent,
  treeData: TreeNodeWithId[],
  setDraggedNode: (node: TreeNodeWithId | null) => void,
  setTreeData: (data: TreeNodeWithId[]) => void,
  setOverId: (id: string | null) => void,
  dragPosition: DragPosition,
  setDragPosition: (position: DragPosition) => void
) => {
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
