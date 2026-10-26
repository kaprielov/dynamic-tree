import { useState } from 'react';
import Tree from '@/components/Tree';
import Sidebar from '@/components/Sidebar';

const App = () => {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [reset, setReset] = useState(0);
  return (
    <main className="workspace">
      <header className="masthead">
        <a href="./">
          FIELDNOTES <span>/ Dynamic Tree</span>
        </a>
        <a href="https://github.com/kaprielov/dynamic-tree">View source ↗</a>
      </header>
      <section className="intro">
        <p className="eyebrow">An interactive document collection</p>
        <h1>
          A place for
          <br />
          connected ideas.
        </h1>
        <p>
          Rearrange a collection. Explore its details. Keep the bigger picture
          in view.
        </p>
      </section>
      <div className="collection-layout">
        <section className="collection" aria-labelledby="collection-title">
          <div className="section-heading">
            <h2 id="collection-title">Your collection</h2>
            <button
              onClick={() => {
                setReset((value) => value + 1);
                setSelectedEntryId(null);
              }}
            >
              Reset collection
            </button>
          </div>
          <Tree key={reset} onSelectEntry={setSelectedEntryId} />
          <p className="usage-note">
            Drag the dotted handle above, inside, or below another item. Select
            an item to use the keyboard-accessible movement buttons.
          </p>
        </section>
        <aside className="detail-panel" aria-label="Document details">
          <p className="eyebrow">Reading pane</p>
          {selectedEntryId ? (
            <Sidebar key={selectedEntryId} entryId={selectedEntryId} />
          ) : (
            <>
              <h2>Follow an idea.</h2>
              <p>Select a document in the collection to read its notes here.</p>
            </>
          )}
        </aside>
      </div>
      <footer>
        Synthetic demo content · Changes stay in this session · React +
        TypeScript
      </footer>
    </main>
  );
};
export default App;
