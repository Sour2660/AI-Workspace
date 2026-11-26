import { create } from "zustand";
import type { Project } from "@/features/project/types";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  selectedWorkspaceId: string;
  isLoading: boolean;
  error: string | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setSelectedWorkspaceId: (workspaceId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  selectedWorkspaceId: "",
  isLoading: false,
  error: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (currentProject) => set({ currentProject }),
  setSelectedWorkspaceId: (selectedWorkspaceId) =>
    set({ selectedWorkspaceId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
