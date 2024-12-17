import { TreeNode, TreeNodeWithId } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Recursively adds unique elementId for tree nodes,
 * if they are missing.
 * @param data Array of tree nodes
 * @returns New array of nodes with guaranteed elementIds
 */
export const addUniqueIds = (data: TreeNode[]): TreeNodeWithId[] => {
  return data.map((node) => ({
    ...node,
    elementId: uuidv4(),
    children: node.children ? addUniqueIds(node.children) : undefined,
  }));
};
