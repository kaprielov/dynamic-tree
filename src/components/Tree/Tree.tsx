import { TreeNode } from '../../types';

interface TreeProps {
  data: TreeNode[];
  onSelectEntry: (id: string) => void;
}

const Tree = ({ data, onSelectEntry }: TreeProps) => {
  return (
    <ul>
      {data.map((node) => (
        <TreeNodeItem
          key={node.id || node.label}
          node={node}
          onSelectEntry={onSelectEntry}
        />
      ))}
    </ul>
  );
};

interface TreeNodeItemProps {
  node: TreeNode;
  onSelectEntry: (id: string) => void;
}

const TreeNodeItem = ({ node, onSelectEntry }: TreeNodeItemProps) => {
  const handleClick = () => {
    if (node.id) {
      onSelectEntry(node.id);
    }
  };

  return (
    <li onClick={handleClick} style={{ cursor: 'pointer' }}>
      {node.label}
      {node.children && (
        <ul>
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id || child.label}
              node={child}
              onSelectEntry={onSelectEntry}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Tree;
