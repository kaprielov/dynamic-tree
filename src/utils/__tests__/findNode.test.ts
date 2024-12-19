import { findNode } from '@/utils';
import { TreeNodeWithId } from '@/types';

describe('findNode', () => {
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
          ],
        },
      ],
    },
    { id: '2', label: 'Node 2', elementId: 'id-5' },
  ];

  it('should find a node and return it along with its parent', () => {
    // Act
    const [foundNode, parent] = findNode(tree, 'id-4');

    // Assert
    expect(foundNode).toEqual({
      id: '1-2-1',
      label: 'Node 1-2-1',
      elementId: 'id-4',
    });
    expect(parent).toEqual({
      id: '1-2',
      label: 'Node 1-2',
      elementId: 'id-3',
      children: [
        { id: '1-2-1', label: 'Node 1-2-1', elementId: 'id-4' },
      ],
    });
  });

  it('should find a root node and return null as its parent', () => {
    // Act
    const [foundNode, parent] = findNode(tree, 'id-1');

    // Assert
    expect(foundNode).toEqual({
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
          ],
        },
      ],
    });
    expect(parent).toBeNull();
  });

  it('should return [null, null] if the elementId is not found', () => {
    // Act
    const [foundNode, parent] = findNode(tree, 'non-existent-id');

    // Assert
    expect(foundNode).toBeNull();
    expect(parent).toBeNull();
  });

  it('should find a direct child node and return the correct parent', () => {
    // Act
    const [foundNode, parent] = findNode(tree, 'id-2');

    // Assert
    expect(foundNode).toEqual({
      id: '1-1',
      label: 'Node 1-1',
      elementId: 'id-2',
    });
    expect(parent).toEqual({
      id: '1',
      label: 'Node 1',
      elementId: 'id-1',
      children: expect.any(Array),
    });
  });
});
