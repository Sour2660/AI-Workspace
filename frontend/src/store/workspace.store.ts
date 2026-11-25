import { create } from "zustand";
import type { Workspace } from "../types/workspace";

console.log("Workspace Store Loaded");

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;

  setWorkspaces: (data: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  currentWorkspace: null,

  setWorkspaces: (data) => {
    console.log("Setting workspaces", data);
    set({ workspaces: data });
  },

  setCurrentWorkspace: (workspace) => {
    console.log("Current workspace", workspace);
    set({ currentWorkspace: workspace });
  },
}));