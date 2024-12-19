import { useState } from 'react';
import Tree from '@/components/Tree';
import Sidebar from '@/components/Sidebar';

const App = () => {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const handleSelectEntry = (id: string) => {
    setSelectedEntryId(id);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div>
        <h2>Tree</h2>
        <Tree onSelectEntry={handleSelectEntry}/>
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
