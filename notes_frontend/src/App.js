import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import "./index.css";
import AuthPage from "./components/AuthPage";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NotesMain from "./components/NotesMain";
import NoteModal from "./components/NoteModal";

// API base URL should point to your running backend service (change if needed)
const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

// --- Utility functions ---
function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

function fetchWithAuth(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(getToken() ? { Authorization: "Bearer " + getToken() } : {})
  };
  return fetch(API_BASE + url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
}

// --- App Component ---
function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  // Notes state
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [search, setSearch] = useState("");
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNote, setModalNote] = useState(null);

  // Responsive sidebar (mobile)
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // =================== AUTH SECTION ===================
  // Check if user is logged in on mount
  useEffect(() => {
    const tryFetchProfile = async () => {
      if (!getToken()) {
        setAuthLoading(false); setUser(null); return;
      }
      try {
        const res = await fetchWithAuth("/auth/me");
        if (res.ok) {
          setUser(await res.json());
        } else {
          setToken(null); setUser(null);
        }
      } catch {
        setToken(null); setUser(null);
      }
      setAuthLoading(false);
    };
    tryFetchProfile();
  }, []);

  // Handle auth callback from child
  const handleAuth = (data) => {
    if (data && data.token) {
      setToken(data.token);
      // fetch profile
      fetchWithAuth("/auth/me")
        .then(res => res.json())
        .then(setUser)
        .catch(() => setUser(null));
    }
  };

  const handleLogout = () => {
    setToken(null); setUser(null); setNotes([]); setTags([]); // clear all
  };

  // =================== DATA FETCH SECTION ===================
  // Fetch notes
  const fetchNotes = useCallback(async () => {
    if (!user) return;
    let url = `/notes?`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (selectedTags.length) url += `tags=${encodeURIComponent(selectedTags.join(","))}`;
    const res = await fetchWithAuth(url);
    if (res.ok) setNotes(await res.json());
    else setNotes([]);
  }, [user, search, selectedTags]);

  // Fetch tags for user
  const fetchTags = useCallback(async () => {
    if (!user) return;
    const res = await fetchWithAuth("/tags");
    if (res.ok) setTags(await res.json());
    else setTags([]);
  }, [user]);

  // Load notes and tags when user logs in or filters change
  useEffect(() => {
    if (user) {
      fetchNotes();
      fetchTags();
    }
  }, [user, fetchNotes, fetchTags]);

  // =================== NOTES CRUD OPERATIONS ===================
  const handleCreate = async (note) => {
    const res = await fetchWithAuth("/notes", {
      method: "POST",
      body: JSON.stringify(note)
    });
    if (res.ok) {
      await fetchNotes();
      await fetchTags();
      setModalOpen(false);
    }
  };

  const handleEdit = async (note) => {
    const res = await fetchWithAuth(`/notes/${note.id}`, {
      method: "PUT",
      body: JSON.stringify(note)
    });
    if (res.ok) {
      await fetchNotes();
      await fetchTags();
      setModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note permanently?")) return;
    const res = await fetchWithAuth(`/notes/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchNotes();
      await fetchTags();
    }
  };

  // =================== MODAL HANDLING ===================
  const openCreateModal = () => {
    setModalNote(null);
    setModalOpen(true);
  };
  const openEditModal = (note) => {
    setModalNote(note);
    setModalOpen(true);
  };

  // =================== TAG FILTER HANDLING ===================
  const handleTagSelect = (tag) => {
    setSelectedTags(tagsSelected =>
      tagsSelected.includes(tag) ? tagsSelected.filter(t => t !== tag) : [...tagsSelected, tag]
    );
  };
  const handleTagClear = () => setSelectedTags([]);

  // =================== SEARCH HANDLING ===================
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // =================== RESPONSIVE SIDEBAR ===================
  const toggleSidebar = () => setSidebarVisible(show => !show);

  // --- Render ---
  if (authLoading) {
    return <div className="splash">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="app-auth-bg">
        <AuthPage onAuth={handleAuth} API_BASE={API_BASE} />
      </div>
    );
  }

  return (
    <div className="notes-app-root">
      <Header user={user} onLogout={handleLogout} onSidebarToggle={toggleSidebar} onCreate={openCreateModal} />
      <div className="notes-app-body">
        <Sidebar
          tags={tags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onTagClear={handleTagClear}
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
        />
        <main className="notes-app-main">
          <div className="notes-toolbar">
            <input
              type="text"
              className="search-bar"
              placeholder="Search notes..."
              value={search}
              onChange={handleSearch}
            />
            <button className="btn-primary" onClick={openCreateModal} style={{ marginLeft: 8 }}>
              + New Note
            </button>
          </div>
          <NotesMain
            notes={notes}
            tags={tags}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </main>
      </div>
      <NoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
        onEdit={handleEdit}
        tags={tags}
        note={modalNote}
      />
    </div>
  );
}

export default App;
