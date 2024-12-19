import { isDescendant } from '@/utils';
import { TreeNodeWithId } from '@/types';

describe('isDescendant', () => {
  const tree: TreeNodeWithId[] = [
    {
      id: '1',
      label: 'Node 1',
      elementId: 'id-1',
      children: [
        { id: '1-1', label: 'Node 1-1', elementId: 'id-2' },
        {
          id: '1-2',
          label: 'Node 1-2',
          elementId: 'id-3',
          children: [
            { id: '1-2-1', label: 'Node 1-2-1', elementId: 'id-4' },
            { id: '1-2-2', label: 'Node 1-2-2', elementId: 'id-5' },
          ],
        },
      ],
    },
    { id: '2', label: 'Node 2', elementId: 'id-6' },
  ];

  it('should return true if targetElementId is a direct child of sourceElementId', () => {
    const result = isDescendant(tree, 'id-1', 'id-2');
    expect(result).toBe(true);
  });

  it('should return true if targetElementId is a deeply nested descendant of sourceElementId', () => {
    const result = isDescendant(tree, 'id-1', 'id-4');
    expect(result).toBe(true);
  });

  it('should return false if targetElementId is not a descendant of sourceElementId', () => {
    const result = isDescendant(tree, 'id-1', 'id-6');
    expect(result).toBe(false);
  });

  it('should return false if sourceElementId does not exist', () => {
    const result = isDescendant(tree, 'non-existent-id', 'id-4');
    expect(result).toBe(false);
  });

  it('should return false if targetElementId does not exist', () => {
    const result = isDescendant(tree, 'id-1', 'non-existent-id');
    expect(result).toBe(false);
  });

  it('should return false if sourceElementId has no children', () => {
    const result = isDescendant(tree, 'id-6', 'id-4'); // id-6 is a leaf node
    expect(result).toBe(false);
  });
});
