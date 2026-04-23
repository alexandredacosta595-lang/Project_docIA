import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import { mockDocuments, mockFolders } from '../mockData';
import type { Document, Folder } from '../types/document';
import { v4 as uuidv4 } from 'uuid';

// ─── State ────────────────────────────────────────────────────────────────────

interface AppState {
  documents: Document[];
  folders: Folder[];
  activeDocId: string | null;
}

const initialState: AppState = {
  documents: mockDocuments,
  folders: mockFolders,
  activeDocId: null,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_ACTIVE_DOC'; id: string | null }
  | { type: 'CREATE_FOLDER'; name: string; color: string; icon: string }
  | { type: 'DELETE_FOLDER'; id: string }
  | { type: 'MOVE_DOCUMENT'; docId: string; folderId: string | undefined }
  | { type: 'DELETE_DOCUMENT'; id: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ACTIVE_DOC':
      return { ...state, activeDocId: action.id };

    case 'CREATE_FOLDER': {
      const newFolder: Folder = {
        id: `folder-${uuidv4()}`,
        name: action.name,
        color: action.color,
        icon: action.icon,
        isSystem: false,
        createdAt: new Date().toISOString(),
      };
      return { ...state, folders: [...state.folders, newFolder] };
    }

    case 'DELETE_FOLDER': {
      // Move documents from deleted folder to uncategorized (undefined)
      const docs = state.documents.map((d) =>
        d.folderId === action.id ? { ...d, folderId: undefined } : d
      );
      return {
        ...state,
        folders: state.folders.filter((f) => f.id !== action.id),
        documents: docs,
      };
    }

    case 'MOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map((d) =>
          d.id === action.docId ? { ...d, folderId: action.folderId } : d
        ),
      };

    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter((d) => d.id !== action.id),
      };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  setActiveDoc: (id: string | null) => void;
  createFolder: (name: string, color: string, icon: string) => void;
  deleteFolder: (id: string) => void;
  moveDocument: (docId: string, folderId: string | undefined) => void;
  deleteDocument: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setActiveDoc = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_DOC', id });
  }, []);

  const createFolder = useCallback((name: string, color: string, icon: string) => {
    dispatch({ type: 'CREATE_FOLDER', name, color, icon });
  }, []);

  const deleteFolder = useCallback((id: string) => {
    dispatch({ type: 'DELETE_FOLDER', id });
  }, []);

  const moveDocument = useCallback((docId: string, folderId: string | undefined) => {
    dispatch({ type: 'MOVE_DOCUMENT', docId, folderId });
  }, []);

  const deleteDocument = useCallback((id: string) => {
    dispatch({ type: 'DELETE_DOCUMENT', id });
  }, []);

  return (
    <AppContext.Provider value={{ state, setActiveDoc, createFolder, deleteFolder, moveDocument, deleteDocument }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
