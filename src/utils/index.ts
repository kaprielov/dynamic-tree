import { TreeNode, TreeNodeWithId } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Recursively adds unique elementId for tree nodes,
 * if they are missing.
 * @param data Array of tree nodes
 * @returns New array of nodes with guaranteed elementIds
 */
export const addUniqueIds = (data: TreeNode[]): TreeNodeWithId[] => {
  return data.map((node) => {
    const newNode = {
      ...node,
      elementId: uuidv4(),
    } as TreeNodeWithId;

    if (node.children) {
      newNode.children = addUniqueIds(node.children) as TreeNodeWithId[];
    }

    return newNode;
  });
};

/**
 * Finds a node by elementId and returns it along with its parent.
 * @param tree Tree
 * @param elementId Identifier
 * @param parent Parent node (used recursively)
 * @returns [found node or null, parent or null]
 */
export const findNode = (tree: TreeNodeWithId[], elementId: string, parent?: TreeNodeWithId): [TreeNodeWithId | null, TreeNodeWithId | null] => {
  for (const node of tree) {
    if (node.elementId === elementId) {
      return [node, parent || null];
    }
    if (node.children) {
      const [found, par] = findNode(node.children, elementId, node);
      if (found) return [found, par];
    }
  }
  return [null, null];
}

/**
 * Removes a node with the specified elementId from the tree and returns a tuple [removed node, new tree without it].
 * @param tree Array of tree nodes
 * @param elementId Identifier of the node to remove
 * @returns [removed node or null, new tree]
 */
export const removeNode = (
  tree: TreeNodeWithId[],
  elementId: string
): [TreeNodeWithId | null, TreeNodeWithId[]] => {
  let removedNode: TreeNodeWithId | null = null;

  const newTree = tree
    .map((node) => {
      if (node.elementId === elementId) {
        removedNode = node;
        return null;
      }

      if (node.children) {
        const [childRemoved, updatedChildren] = removeNode(node.children, elementId);
        if (childRemoved) {
          removedNode = childRemoved;
        }
        return { ...node, children: updatedChildren };
      }

      return node;
    })
    .filter(Boolean) as TreeNodeWithId[];

  return [removedNode, newTree];
}

/**
 * Inserts the nodeToInsert as a child of the node with targetElementId.
 * If the target node does not have children, they will be created.
 * If the target node is not found, returns null.
 * @param tree Array of tree nodes
 * @param targetElementId Identifier of the node where the new node will be inserted
 * @param nodeToInsert Node to insert
 * @returns New tree or null
 */
export const insertNode = (
  tree: TreeNodeWithId[],
  targetElementId: string,
  nodeToInsert: TreeNodeWithId
): TreeNodeWithId[] | null => {
  let found = false;

  const newTree = tree.map((node) => {
    if (node.elementId === targetElementId) {
      found = true;
      const updatedChildren = node.children ? [...node.children, nodeToInsert] : [nodeToInsert];
      return { ...node, children: updatedChildren };
    }

    if (node.children) {
      const updatedChildren = insertNode(node.children, targetElementId, nodeToInsert);
      if (updatedChildren) {
        found = true;
        return { ...node, children: updatedChildren };
      }
    }

    return node;
  });

  return found ? newTree : null;
}

/**
 * Inserts the nodeToInsert above or below the node with targetElementId as a sibling.
 * If the target node is not found, returns null.
 * @param tree Array of tree nodes
 * @param targetElementId Identifier of the target node
 * @param nodeToInsert Node to insert
 * @param position 'above' or 'below'
 * @returns New tree or null
 */
export const insertNodeAsSibling = (
  tree: TreeNodeWithId[],
  targetElementId: string,
  nodeToInsert: TreeNodeWithId,
  position: 'above' | 'below'
): TreeNodeWithId[] | null => {
  const newTree = JSON.parse(JSON.stringify(tree));

  const [targetNode, parentNode] = findNode(newTree, targetElementId);
  if (!targetNode) return null;

  if (!parentNode) {
    const index = newTree.findIndex((n: TreeNodeWithId) => n.elementId === targetElementId);
    if (index === -1) return null;
    const insertIndex = position === 'above' ? index : index + 1;
    newTree.splice(insertIndex, 0, nodeToInsert);
    return newTree;
  }

  if (!parentNode.children) return null;

  const idx = parentNode.children.findIndex((ch) => ch.elementId === targetElementId);
  if (idx === -1) return null;

  const insertIndex = position === 'above' ? idx : idx + 1;
  parentNode.children.splice(insertIndex, 0, nodeToInsert);
  return newTree;
}


/**
 * Checks if the targetElementId is a descendant of the node with elementId = sourceElementId.
 * @param tree Tree
 * @param sourceElementId Element from which the movement originates
 * @param targetElementId Target element to check
 * @returns true if targetElementId is a descendant of sourceElementId
 */
export const isDescendant = (tree: TreeNodeWithId[], sourceElementId: string, targetElementId: string): boolean => {
  const [sourceNode] = findNode(tree, sourceElementId);
  if (!sourceNode || !sourceNode.children) return false;

  const stack = [...sourceNode.children];
  while (stack.length) {
    const node = stack.pop()!;
    if (node.elementId === targetElementId) return true;
    if (node.children) {
      stack.push(...node.children);
    }
  }
  return false;
}
