import { addUniqueIds } from '@/utils';
import { TreeNode, TreeNodeWithId } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock uuidv4 to return predictable IDs for testing
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addUniqueIds', () => {
  it('should add unique elementIds to each node recursively', () => {
    // Arrange
    (uuidv4 as jest.Mock)
      .mockImplementationOnce(() => 'id-1')
      .mockImplementationOnce(() => 'id-2')
      .mockImplementationOnce(() => 'id-3')
      .mockImplementationOnce(() => 'id-4');

    const input: TreeNode[] = [
      {
        id: '1',
        label: 'Node 1',
        children: [
          { id: '1-1', label: 'Node 1-1' },
          { id: '1-2', label: 'Node 1-2' },
        ],
      },
      { id: '2', label: 'Node 2' },
    ];

    const expected: TreeNodeWithId[] = [
      {
        id: '1',
        label: 'Node 1',
        elementId: 'id-1',
        children: [
          { id: '1-1', label: 'Node 1-1', elementId: 'id-2' },
          { id: '1-2', label: 'Node 1-2', elementId: 'id-3' },
        ],
      },
      { id: '2', label: 'Node 2', elementId: 'id-4' }, // Новый элементId для второго узла
    ];

    // Act
    const result = addUniqueIds(input);

    // Assert
    expect(result).toEqual(expected);
    expect(uuidv4).toHaveBeenCalledTimes(4); // 4 вызова
  });

  it('should handle empty array', () => {
    const input: TreeNode[] = [];
    const expected: TreeNodeWithId[] = [];
    expect(addUniqueIds(input)).toEqual(expected);
  });

  it('should handle nodes without children', () => {
    (uuidv4 as jest.Mock).mockImplementationOnce(() => 'id-1');
    const input: TreeNode[] = [{ id: '1', label: 'Node 1' }];
    const expected: TreeNodeWithId[] = [
      { id: '1', label: 'Node 1', elementId: 'id-1' },
    ];
    expect(addUniqueIds(input)).toEqual(expected);
    expect(uuidv4).toHaveBeenCalledTimes(1);
  });
});
