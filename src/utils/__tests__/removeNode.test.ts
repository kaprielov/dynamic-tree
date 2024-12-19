import { removeNode } from '@/utils';
import { TreeNodeWithId } from '@/types';

describe('removeNode', () => {
  const initialTree: TreeNodeWithId[] = [
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

  it('should remove a node with no children and return the updated tree', () => {
    const [removedNode, newTree] = removeNode(initialTree, 'id-5');

    expect(removedNode).toEqual({
      id: '2',
      label: 'Node 2',
      elementId: 'id-5',
    });
    expect(newTree).toEqual([
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
    ]);
  });

  it('should remove a node with children and return the updated tree', () => {
    const [removedNode, newTree] = removeNode(initialTree, 'id-3');

    expect(removedNode).toEqual({
      id: '1-2',
      label: 'Node 1-2',
      elementId: 'id-3',
      children: [
        { id: '1-2-1', label: 'Node 1-2-1', elementId: 'id-4' },
      ],
    });
    expect(newTree).toEqual([
      {
        id: '1',
        label: 'Node 1',
        elementId: 'id-1',
        children: [
          { id: '1-1', label: 'Node 1-1', elementId: 'id-2' },
        ],
      },
      { id: '2', label: 'Node 2', elementId: 'id-5' },
    ]);
  });

  it('should return null and the original tree if elementId is not found', () => {
    const [removedNode, newTree] = removeNode(initialTree, 'non-existent-id');

    expect(removedNode).toBeNull();
    expect(newTree).toEqual(initialTree);
  });

  it('should remove a deeply nested node and return the updated tree', () => {
    const [removedNode, newTree] = removeNode(initialTree, 'id-4');

    expect(removedNode).toEqual({
      id: '1-2-1',
      label: 'Node 1-2-1',
      elementId: 'id-4',
    });
    expect(newTree).toEqual([
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
            children: [],
          },
        ],
      },
      { id: '2', label: 'Node 2', elementId: 'id-5' },
    ]);
  });

  it('should handle an empty tree', () => {
    const [removedNode, newTree] = removeNode([], 'id-1');

    expect(removedNode).toBeNull();
    expect(newTree).toEqual([]);
  });
});
