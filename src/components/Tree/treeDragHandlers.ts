import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { TreeNodeWithId, DragPosition } from '@/types';
import {
  removeNode,
  insertNode,
  isDescendant,
  insertNodeAsSibling,
} from '@/utils';

/**
 * Handles the start of a drag event.
 *
 * @param event - The drag start event from dnd-kit.
 * @param treeData - The current tree structure data.
 * @param setDraggedNode - Function to set the currently dragged node.
 */
export const handleDragStart = (
  event: DragStartEvent,
  treeData: TreeNodeWithId[],
  setDraggedNode: (found: TreeNodeWithId | null) => void
) => {
  const { active } = event; // Get the active (dragged) item from the event
  
  // Create a copy of the tree data to traverse
  const stack = [...treeData];
  let found: TreeNodeWithId | null = null;

  // Perform a depth-first search to find the dragged node
  while (stack.length) {
    const node = stack.pop()!; // Get the last node in the stack
    if (node.elementId === active.id) { // Check if this node is the dragged node
      found = node; // Node found
      break; // Exit the loop
    }
    if (node.children) {
      stack.push(...node.children); // Add child nodes to the stack for further searching
    }
  }

  setDraggedNode(found); // Update the state with the found dragged node
};

/**
 * Handles the drag over event to determine the drop position.
 *
 * @param event - The drag over event from dnd-kit.
 * @param overId - The current ID of the element being hovered over.
 * @param dragPosition - The current position relative to the hovered element.
 * @param setOverId - Function to update the hovered element's ID.
 * @param setDragPosition - Function to update the drag position.
 */
export const handleDragMove = (
  event: DragOverEvent,
  overId: string | null,
  dragPosition: DragPosition,
  setOverId: (id: string | null) => void,
  setDragPosition: (position: DragPosition) => void
) => {
  const { over, activatorEvent, delta } = event; // Destructure relevant properties from the event

  // If there's no element being hovered over, reset the overId and dragPosition
  if (!over) {
    if (overId !== null) setOverId(null);
    if (dragPosition !== null) setDragPosition(null);
    return null;
  }

  const newOverId = over.id.toString(); // Get the ID of the hovered element as a string
  let newDragPosition: DragPosition = null;

  // If the droppable element exists and the activator event is a mouse event
  if (activatorEvent instanceof MouseEvent) {
    const { rect } = over; // Get the bounding rectangle of the element
    const { top, height } = rect; // Get the bounding rectangle of the element
    const y = activatorEvent.clientY + delta.y; // Calculate the Y position of the mouse relative to the element

    const topBoundary = top + height / 3;
    const bottomBoundary = top + (2 * height) / 3;

    if (y < topBoundary) {
      newDragPosition = 'above';
    } else if (y < bottomBoundary) {
      newDragPosition = 'inside';
    } else {
      newDragPosition = 'below';
    }
  }

  // Update the overId state if it has changed
  if (newOverId !== overId) setOverId(newOverId);
  
  // Update the dragPosition state if it has changed
  if (newDragPosition !== dragPosition) setDragPosition(newDragPosition);
};

/**
 * Handles the end of a drag event, updating the tree structure accordingly.
 *
 * @param event - The drag end event from dnd-kit.
 * @param treeData - The current tree structure data.
 * @param setDraggedNode - Function to reset the dragged node state.
 * @param setTreeData - Function to update the tree structure data.
 * @param setOverId - Function to reset the hovered element's ID.
 * @param dragPosition - The final drag position relative to the hovered element.
 * @param setDragPosition - Function to reset the drag position state.
 */
export const handleDragEnd = (
  event: DragEndEvent,
  treeData: TreeNodeWithId[],
  setDraggedNode: (node: TreeNodeWithId | null) => void,
  setTreeData: (data: TreeNodeWithId[]) => void,
  setOverId: (id: string | null) => void,
  dragPosition: DragPosition,
  setDragPosition: (position: DragPosition) => void
) => {
  const { active, over } = event; // Destructure active and over from the event
  
  setDraggedNode(null); // Reset the dragged node state
  
  const currentDragPosition = dragPosition; // Store the current drag position
  
  setOverId(null); // Reset the hovered element's ID
  setDragPosition(null); // Reset the drag position state

  // If the item is not dropped over a valid target, exit the function
  if (!over) {
    return null;
  }

  const draggedNodeId = active.id as string; // Get the ID of the dragged node
  const targetNodeId = over.id as string; // Get the ID of the target node

  // Prevent dropping the node onto itself or one of its descendants
  if (draggedNodeId === targetNodeId || isDescendant(treeData, draggedNodeId, targetNodeId)) {
    return null;
  }

  // Remove the dragged node from its original position in the tree
  const [removedNode, newTreeWithoutDragged] = removeNode(treeData, draggedNodeId);
  if (!removedNode) return null; // If the node wasn't found, exit

  let updatedTree: TreeNodeWithId[] | null = null;

  // Insert the removed node into the new position based on the drag position
  if (currentDragPosition === 'inside') {
    updatedTree = insertNode(newTreeWithoutDragged, targetNodeId, removedNode);
  } else if (currentDragPosition === 'above' || currentDragPosition === 'below') {
    updatedTree = insertNodeAsSibling(newTreeWithoutDragged, targetNodeId, removedNode, currentDragPosition);
  }

  if (!updatedTree) return null; // If insertion failed, exit

  setTreeData(updatedTree); // Update the tree data with the new structure

  // console.log('Updated Tree:', JSON.stringify(updatedTree, null, 2)); // Log the updated tree for debugging
};
