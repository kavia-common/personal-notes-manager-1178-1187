import React from "react";

// PUBLIC_INTERFACE
function NotesMain({ notes, tags, onEdit, onDelete }) {
  if (!notes || notes.length === 0) {
    return <div className="notes-empty">No notes found</div>;
  }
  return (
    <section className="notes-main-list">
      {notes.map(note => (
        <div className="note-card" key={note.id}>
          <div className="note-card-header">
            <h3 className="note-title">{note.title}</h3>
            <div>
              <button
                className="btn-icon"
                title="Edit"
                onClick={() => onEdit(note)}
              >✎</button>
              <button
                className="btn-icon"
                title="Delete"
                onClick={() => onDelete(note.id)}
              >🗑</button>
            </div>
          </div>
          <div className="note-content">{note.content && note.content.substring(0, 280)}</div>
          <div className="note-tags">
            {note.tags && note.tags.map(tag =>
              <span className="tag-chip tag-chip-card" key={tag}>{tag}</span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export default NotesMain;
