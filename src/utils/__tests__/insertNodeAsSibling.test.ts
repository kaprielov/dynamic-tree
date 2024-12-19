import { insertNodeAsSibling } from '@/utils';
import { TreeNodeWithId } from '@/types';

describe('insertNodeAsSibling', () => {
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

  it('should insert a node above a root node', () => {
    const nodeToInsert: TreeNodeWithId = { id: '3', label: 'New Node', elementId: 'id-6' };

    const result = insertNodeAsSibling(initialTree, 'id-5', nodeToInsert, 'above');

    expect(result).toEqual([
      { id: '1', label: 'Node 1', elementId: 'id-1', children: expect.any(Array) },
      { id: '3', label: 'New Node', elementId: 'id-6' }, // Вставленный узел
      { id: '2', label: 'Node 2', elementId: 'id-5' },
    ]);
  });

  it('should insert a node below a root node', () => {
    const nodeToInsert: TreeNodeWithId = { id: '4', label: 'Below Node', elementId: 'id-7' };

    const result = insertNodeAsSibling(initialTree, 'id-1', nodeToInsert, 'below');

    expect(result).toEqual([
      { id: '1', label: 'Node 1', elementId: 'id-1', children: expect.any(Array) },
      { id: '4', label: 'Below Node', elementId: 'id-7' }, // Вставленный узел
      { id: '2', label: 'Node 2', elementId: 'id-5' },
    ]);
  });

  it('should insert a node above a child node', () => {
    const nodeToInsert: TreeNodeWithId = { id: '5', label: 'Sibling Above', elementId: 'id-8' };

    const result = insertNodeAsSibling(initialTree, 'id-3', nodeToInsert, 'above');

    expect(result).toEqual([
      {
        id: '1',
        label: 'Node 1',
        elementId: 'id-1',
        children: [
          { id: '1-1', label: 'Node 1-1', elementId: 'id-2' },
          { id: '5', label: 'Sibling Above', elementId: 'id-8' }, // Вставленный узел
          {
            id: '1-2',
            label: 'Node 1-2',
            elementId: 'id-3',
            children: [{ id: '1-2-1', label: 'Node 1-2-1', elementId: 'id-4' }],
          },
        ],
      },
      { id: '2', label: 'Node 2', elementId: 'id-5' },
    ]);
  });

  it('should insert a node below a child node', () => {
    const nodeToInsert: TreeNodeWithId = { id: '6', label: 'Sibling Below', elementId: 'id-9' };

    const result = insertNodeAsSibling(initialTree, 'id-2', nodeToInsert, 'below');

    expect(result).toEqual([
      {
        id: '1',
        label: 'Node 1',
        elementId: 'id-1',
        children: [
          { id: '1-1', label: 'Node 1-1', elementId: 'id-2' },
          { id: '6', label: 'Sibling Below', elementId: 'id-9' }, // Вставленный узел
          {
            id: '1-2',
            label: 'Node 1-2',
            elementId: 'id-3',
            children: [{ id: '1-2-1', label: 'Node 1-2-1', elementId: 'id-4' }],
          },
        ],
      },
      { id: '2', label: 'Node 2', elementId: 'id-5' },
    ]);
  });

  it('should return null if target node is not found', () => {
    const nodeToInsert: TreeNodeWithId = { id: '7', label: 'Missing Node', elementId: 'id-10' };

    const result = insertNodeAsSibling(initialTree, 'non-existent-id', nodeToInsert, 'above');

    expect(result).toBeNull();
  });

  it('should handle an empty tree and return null', () => {
    const nodeToInsert: TreeNodeWithId = { id: '8', label: 'Empty Node', elementId: 'id-11' };

    const result = insertNodeAsSibling([], 'id-1', nodeToInsert, 'below');

    expect(result).toBeNull();
  });
});
