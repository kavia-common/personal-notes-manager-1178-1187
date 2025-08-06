import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
function NoteModal({ open, onClose, onCreate, onEdit, tags, note }) {
  const editing = !!note;
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");
  const [noteTags, setNoteTags] = useState(note ? note.tags || [] : []);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setNoteTags(note.tags || []);
    } else {
      setTitle("");
      setContent("");
      setNoteTags([]);
    }
    setTagInput("");
  }, [open, note]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput && !noteTags.includes(tagInput)) {
      setNoteTags([...noteTags, tagInput]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag) => {
    setNoteTags(tags => tags.filter(t => t !== tag));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      content: content.trim(),
      tags: noteTags
    };
    if (!payload.title) return;
    if (editing) {
      onEdit({ ...note, ...payload });
    } else {
      onCreate(payload);
    }
  };

  if (!open) return null;
  return (
    <div className="modal-outer" tabIndex="-1">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-body">
        <h2>{editing ? "Edit Note" : "New Note"}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-title"
            value={title}
            autoFocus
            required
            maxLength={100}
            placeholder="Note title"
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="input-content"
            rows={6}
            value={content}
            placeholder="Describe your note..."
            onChange={e => setContent(e.target.value)}
          />
          <div className="modal-tags">
            {noteTags.map(tag =>
              <span className="tag-chip tag-chip-edit" key={tag}>
                {tag}
                <button
                  className="tag-remove-btn"
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => handleRemoveTag(tag)}
                >&times;</button>
              </span>
            )}
          </div>
          <div className="tag-adder-row">
            <input
              type="text"
              className="input-tag"
              placeholder="Add tag"
              value={tagInput}
              list="all-tags-list"
              maxLength={24}
              onChange={e => setTagInput(e.target.value.replace(/[^a-zA-Z0-9-_ ]/g, "").toLowerCase().substring(0,24))}
            />
            <datalist id="all-tags-list">
              {tags.filter(t => !noteTags.includes(t)).map(tag =>
                <option value={tag} key={tag} />
              )}
            </datalist>
            <button
              className="tag-add-btn"
              type="button"
              onClick={handleAddTag}
              disabled={!tagInput}
            >Add</button>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">{editing ? "Save" : "Create"}</button>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ marginLeft: "auto" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteModal;
