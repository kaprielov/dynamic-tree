import { useState, useMemo } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { fetchTreeData } from '@/api';
import { TreeNode } from '@/types';
import Tree from '@/components/Tree';
import Sidebar from '@/components/Sidebar';
import { addUniqueIds } from '@/utils';

const App = () => {
  const { data, loading, error } = useFetch<TreeNode[]>(fetchTreeData);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const handleSelectEntry = (id: string) => {
    setSelectedEntryId(id);
  };

  const handleNodeClick = (id: string) => {
    setActiveNodeId((prev) => (prev === id ? null : id));
  };

  const treeData = useMemo(() => {
    if (data) {
      return addUniqueIds(data);
    }
    return [];
  }, [data]);

  // TODO : create a loader component
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div>
        <h2>Tree</h2>
        <Tree
          data={treeData}
          onSelectEntry={handleSelectEntry}
          onNodeClick={handleNodeClick}
          activeNodeId={activeNodeId}
        />
      </div>
      <div>
        <h2>Sidebar</h2>
        {selectedEntryId ? (
          <Sidebar entryId={selectedEntryId} />
        ) : (
          <div>Select a leaf node to view details</div>
        )}
      </div>
    </div>
  );
};

export default App;
