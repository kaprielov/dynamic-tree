import { TreeNode, TreeNodeWithId } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Recursively adds unique `elementId` properties to tree nodes that are missing them.
 * This ensures that every node in the tree has a unique identifier, which is essential
 * for operations like searching, inserting, or removing nodes.
 *
 * @param data - An array of `TreeNode` objects representing the tree structure.
 * @returns A new array of `TreeNodeWithId` objects where each node is guaranteed to have an `elementId`.
 */
export const addUniqueIds = (data: TreeNode[]): TreeNodeWithId[] => {
  // Iterate over each node in the input data array
  return data.map((node) => {
    // Create a new node by spreading the existing properties and adding a unique `elementId`
    const newNode = {
      ...node,
      elementId: uuidv4(), // Generate a new UUID for the elementId
    } as TreeNodeWithId;

    // If the current node has children, recursively add unique IDs to them as well
    if (node.children) {
      newNode.children = addUniqueIds(node.children) as TreeNodeWithId[];
    }

    // Return the newly created node with a unique `elementId`
    return newNode;
  });
};

/**
 * Searches for a node with a specific `elementId` within a tree and returns that node along with its parent node.
 * This function is useful for locating a node and understanding its position within the tree hierarchy.
 *
 * @param tree - An array of `TreeNodeWithId` objects representing the tree to search.
 * @param elementId - The unique identifier of the node to find.
 * @param parent - The parent node of the current node (used internally for recursion).
 * @returns A tuple containing the found node (or `null` if not found) and its parent node (or `null` if it has no parent).
 */
export const findNode = (
  tree: TreeNodeWithId[],
  elementId: string,
  parent?: TreeNodeWithId
): [TreeNodeWithId | null, TreeNodeWithId | null] => {
  // Iterate over each node in the current level of the tree
  for (const node of tree) {
    // Check if the current node's `elementId` matches the target `elementId`
    if (node.elementId === elementId) {
      // If a match is found, return the node and its parent (or null if it has no parent)
      return [node, parent || null];
    }

    // If the current node has children, recursively search within the children
    if (node.children) {
      const [found, par] = findNode(node.children, elementId, node);
      if (found) {
        // If the node is found in the subtree, return it along with its parent
        return [found, par];
      }
    }
  }

  // If the node is not found in the current subtree, return [null, null]
  return [null, null];
};

/**
 * Removes a node with a specified `elementId` from the tree and returns the removed node along with the updated tree.
 * This function is useful for deleting nodes from the tree while preserving the tree's structure.
 *
 * @param tree - An array of `TreeNodeWithId` objects representing the tree.
 * @param elementId - The unique identifier of the node to remove.
 * @returns A tuple containing the removed node (or `null` if not found) and the new tree without the removed node.
 */
export const removeNode = (
  tree: TreeNodeWithId[],
  elementId: string
): [TreeNodeWithId | null, TreeNodeWithId[]] => {
  let removedNode: TreeNodeWithId | null = null; // Initialize the variable to store the removed node

  // Iterate over each node in the tree and map to a new array
  const newTree = tree
    .map((node) => {
      // If the current node matches the `elementId`, mark it for removal
      if (node.elementId === elementId) {
        removedNode = node; // Store the removed node
        return null; // Remove the node by returning null
      }

      // If the node has children, recursively attempt to remove the target node from the children
      if (node.children) {
        const [childRemoved, updatedChildren] = removeNode(node.children, elementId);
        if (childRemoved) {
          removedNode = childRemoved; // Update the removed node if found in the subtree
        }
        // Return a new node with the updated children
        return { ...node, children: updatedChildren };
      }

      // If the node does not match and has no children, return it unchanged
      return node;
    })
    // Filter out any `null` values resulting from removed nodes
    .filter(Boolean) as TreeNodeWithId[];

  // Return the removed node (if any) and the new tree
  return [removedNode, newTree];
};

/**
 * Inserts a new node as a child of a target node identified by `targetElementId`.
 * If the target node does not have any children, a new children array is created.
 * If the target node is not found in the tree, the function returns `null`.
 *
 * @param tree - An array of `TreeNodeWithId` objects representing the tree.
 * @param targetElementId - The unique identifier of the node under which the new node will be inserted.
 * @param nodeToInsert - The `TreeNodeWithId` object to insert into the tree.
 * @returns A new tree with the node inserted, or `null` if the target node was not found.
 */
export const insertNode = (
  tree: TreeNodeWithId[],
  targetElementId: string,
  nodeToInsert: TreeNodeWithId
): TreeNodeWithId[] | null => {
  let found = false; // Flag to indicate whether the target node has been found

  // Iterate over each node in the tree and map to a new array
  const newTree = tree.map((node) => {
    // If the current node matches the `targetElementId`, insert the new node as its child
    if (node.elementId === targetElementId) {
      found = true; // Mark that the target node has been found
      // If the target node already has children, append the new node; otherwise, create a new children array
      const updatedChildren = node.children ? [...node.children, nodeToInsert] : [nodeToInsert];
      // Return a new node with the updated children
      return { ...node, children: updatedChildren };
    }

    // If the node has children, recursively attempt to insert the new node into the subtree
    if (node.children) {
      const updatedChildren = insertNode(node.children, targetElementId, nodeToInsert);
      if (updatedChildren) {
        found = true; // Mark that the target node has been found in the subtree
        // Return a new node with the updated children
        return { ...node, children: updatedChildren };
      }
    }

    // If the node does not match and has no children, return it unchanged
    return node;
  });

  // If the target node was found, return the new tree; otherwise, return null
  return found ? newTree : null;
};

/**
 * Inserts a new node as a sibling (either above or below) of a target node identified by `targetElementId`.
 * This function allows for flexible insertion of nodes at the same hierarchical level.
 * If the target node is not found, the function returns `null`.
 *
 * @param tree - An array of `TreeNodeWithId` objects representing the tree.
 * @param targetElementId - The unique identifier of the node next to which the new node will be inserted.
 * @param nodeToInsert - The `TreeNodeWithId` object to insert into the tree.
 * @param position - Specifies whether to insert the new node 'above' or 'below' the target node.
 * @returns A new tree with the node inserted as a sibling, or `null` if the target node was not found.
 */
export const insertNodeAsSibling = (
  tree: TreeNodeWithId[],
  targetElementId: string,
  nodeToInsert: TreeNodeWithId,
  position: 'above' | 'below'
): TreeNodeWithId[] | null => {
  // Deep clone the tree to avoid mutating the original structure
  const newTree = JSON.parse(JSON.stringify(tree));

  // Find the target node and its parent within the cloned tree
  const [targetNode, parentNode] = findNode(newTree, targetElementId);
  if (!targetNode) return null; // If the target node is not found, return null

  if (!parentNode) {
    // If the target node has no parent, it is a root node
    const index = newTree.findIndex((n: TreeNodeWithId) => n.elementId === targetElementId);
    if (index === -1) return null; // Extra check to ensure the target node exists
    // Determine the insertion index based on the desired position
    const insertIndex = position === 'above' ? index : index + 1;
    // Insert the new node at the calculated position
    newTree.splice(insertIndex, 0, nodeToInsert);
    return newTree; // Return the updated tree
  }

  if (!parentNode.children) return null; // If the parent has no children, insertion as sibling is not possible

  // Find the index of the target node within its parent's children array
  const idx = parentNode.children.findIndex((ch) => ch.elementId === targetElementId);
  if (idx === -1) return null; // Extra check to ensure the target node exists within the parent's children

  // Determine the insertion index based on the desired position
  const insertIndex = position === 'above' ? idx : idx + 1;
  // Insert the new node at the calculated position within the parent's children array
  parentNode.children.splice(insertIndex, 0, nodeToInsert);
  return newTree; // Return the updated tree
};

/**
 * Determines whether a node identified by `targetElementId` is a descendant of another node identified by `sourceElementId`.
 * This is useful for validating tree operations, such as preventing a node from being moved into one of its own descendants.
 *
 * @param tree - An array of `TreeNodeWithId` objects representing the tree.
 * @param sourceElementId - The unique identifier of the node from which the search originates.
 * @param targetElementId - The unique identifier of the node to check as a descendant.
 * @returns `true` if the target node is a descendant of the source node; otherwise, `false`.
 */
export const isDescendant = (
  tree: TreeNodeWithId[],
  sourceElementId: string,
  targetElementId: string
): boolean => {
  // Find the source node within the tree
  const [sourceNode] = findNode(tree, sourceElementId);
  if (!sourceNode || !sourceNode.children) return false; // If the source node doesn't exist or has no children, return false

  // Initialize a stack with the source node's children for iterative depth-first search
  const stack = [...sourceNode.children];
  while (stack.length) {
    const node = stack.pop()!; // Pop the last node from the stack
    if (node.elementId === targetElementId) return true; // If the node matches the target, return true
    if (node.children) {
      stack.push(...node.children); // Add the node's children to the stack for further traversal
    }
  }

  // If the target node was not found in the descendants, return false
  return false;
};
