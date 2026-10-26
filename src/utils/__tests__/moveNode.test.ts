import { moveNode } from '../moveNode';
import type { TreeNodeWithId } from '../../types';

const fixture = (): TreeNodeWithId[] => [
  {
    elementId: 'a',
    label: 'A',
    children: [{ elementId: 'child', label: 'Child' }],
  },
  { elementId: 'b', label: 'B' },
  { elementId: 'c', label: 'C' },
];

test('sibling movement preserves data and leaves its source unchanged', () => {
  const tree = fixture();
  const moved = moveNode(tree, 'b', 'up');
  expect(moved.map((node) => node.elementId)).toEqual(['b', 'a', 'c']);
  expect(moveNode(moved, 'b', 'down')).toEqual(tree);
  expect(tree.map((node) => node.elementId)).toEqual(['a', 'b', 'c']);
});

test('indent and outdent preserve an existing subtree', () => {
  const tree = fixture();
  const moved = moveNode(tree, 'b', 'indent');
  expect(moved[0].children?.map((node) => node.elementId)).toEqual([
    'child',
    'b',
  ]);
  expect(moveNode(moved, 'b', 'outdent')).toEqual(tree);
});

test('outdenting a nested item puts it after its parent', () => {
  expect(
    moveNode(fixture(), 'child', 'outdent').map((node) => node.elementId),
  ).toEqual(['a', 'child', 'b', 'c']);
});

test('unavailable movements and unknown IDs leave the tree unchanged', () => {
  const tree = fixture();
  for (const [id, direction] of [
    ['a', 'up'],
    ['a', 'indent'],
    ['a', 'outdent'],
    ['c', 'down'],
    ['missing', 'down'],
  ] as const) {
    expect(moveNode(tree, id, direction)).toBe(tree);
  }
});
