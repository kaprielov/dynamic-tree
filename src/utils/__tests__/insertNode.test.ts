import { insertNode } from '@/utils';
import { TreeNodeWithId } from '@/types';

describe('insertNode', () => {
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

    it('should insert a node as a child of the target node', () => {
    const nodeToInsert: TreeNodeWithId = {
        id: '3',
        label: 'New Node',
        elementId: 'id-6',
    };

    const result = insertNode(initialTree, 'id-3', nodeToInsert);

    expect(result).toEqual([
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
                { id: '3', label: 'New Node', elementId: 'id-6' }, // Вставленный узел
            ],
            },
        ],
        },
        { id: '2', label: 'Node 2', elementId: 'id-5' },
    ]);
    });


    it('should create children array if target node has no children', () => {
    const nodeToInsert: TreeNodeWithId = {
        id: '4',
        label: 'Child Node',
        elementId: 'id-7',
    };

    const result = insertNode(initialTree, 'id-5', nodeToInsert);

    expect(result).toEqual([
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
        {
        id: '2',
        label: 'Node 2',
        elementId: 'id-5',
        children: [
            { id: '4', label: 'Child Node', elementId: 'id-7' }, // Вставленный узел
        ],
        },
    ]);
    });


    it('should return null if the target node is not found', () => {
    const nodeToInsert: TreeNodeWithId = {
        id: '5',
        label: 'Non-existent Node',
        elementId: 'id-8',
    };

    const result = insertNode(initialTree, 'non-existent-id', nodeToInsert);

    expect(result).toBeNull();
    });

    it('should handle an empty tree and return null', () => {
    const nodeToInsert: TreeNodeWithId = {
        id: '6',
        label: 'Another Node',
        elementId: 'id-9',
    };

    const result = insertNode([], 'id-1', nodeToInsert);

    expect(result).toBeNull();
    });
});
