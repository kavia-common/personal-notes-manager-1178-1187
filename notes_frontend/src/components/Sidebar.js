import React from "react";

// PUBLIC_INTERFACE
function Sidebar({
  tags, selectedTags, onTagSelect, onTagClear,
  sidebarVisible, setSidebarVisible
}) {
  return (
    <aside className={`notes-sidebar${sidebarVisible ? " sidebar-visible" : ""}`}>
      <div className="sidebar-header">
        <span>Tags</span>
        <button
          className="sidebar-close-btn"
          aria-label="Close sidebar"
          onClick={() => setSidebarVisible(false)}
        >&times;</button>
      </div>
      <div className="sidebar-tags">
        <button
          className={`tag-chip${selectedTags.length === 0 ? " tag-chip-selected" : ""}`}
          onClick={onTagClear}
        >All</button>
        {(tags.length > 0)
          ? tags.map(tag => (
            <button
              className={`tag-chip${selectedTags.includes(tag) ? " tag-chip-selected" : ""}`}
              key={tag}
              onClick={() => onTagSelect(tag)}
            >{tag}</button>
          ))
          : <span className="sidebar-none">No tags yet</span>
        }
      </div>
      <footer className="sidebar-footer">
        <span style={{ fontSize: 12, color: "#aaa" }}>&copy; NotesApp</span>
      </footer>
    </aside>
  );
}

export default Sidebar;
