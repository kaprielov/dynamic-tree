import type { TreeNodeWithId } from '../types';
import { findNode, insertNode, insertNodeAsSibling, removeNode } from './index';

export type MoveDirection = 'up' | 'down' | 'indent' | 'outdent';

export function moveNode(
  tree: TreeNodeWithId[],
  id: string,
  direction: MoveDirection,
): TreeNodeWithId[] {
  const [node, parent] = findNode(tree, id);
  if (!node) return tree;
  const siblings = parent?.children ?? tree;
  const index = siblings.findIndex((item) => item.elementId === id);
  const target =
    direction === 'outdent'
      ? parent
      : siblings[index + (direction === 'down' ? 1 : -1)];
  if (!target) return tree;
  const [removed, remaining] = removeNode(tree, id);
  if (!removed) return tree;
  return direction === 'indent'
    ? (insertNode(remaining, target.elementId, removed) ?? tree)
    : (insertNodeAsSibling(
        remaining,
        target.elementId,
        removed,
        direction === 'up' ? 'above' : 'below',
      ) ?? tree);
}
