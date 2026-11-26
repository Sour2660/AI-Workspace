import { useCallback } from "react";
import axios from "axios";
import projectService from "@/features/project/project.service";
import { useProjectStore } from "@/features/project/project.store";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/features/project/types";

let latestProjectListRequest = 0;

const getErrorMessage = (error: unknown) =>
  axios.isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? error.message
    : error instanceof Error
      ? error.message
      : "Something went wrong while loading projects.";

export const useProject = () => {
  const projects = useProjectStore((state) => state.projects);
  const currentProject = useProjectStore((state) => state.currentProject);
  const selectedWorkspaceId = useProjectStore(
    (state) => state.selectedWorkspaceId
  );
  const isLoading = useProjectStore((state) => state.isLoading);
  const error = useProjectStore((state) => state.error);
  const setProjects = useProjectStore((state) => state.setProjects);
  const setCurrentProject = useProjectStore(
    (state) => state.setCurrentProject
  );
  const setSelectedWorkspaceId = useProjectStore(
    (state) => state.setSelectedWorkspaceId
  );
  const setLoading = useProjectStore((state) => state.setLoading);
  const setError = useProjectStore((state) => state.setError);

  const loadProjects = useCallback(
    async (workspaceId: string) => {
      if (!workspaceId) {
        latestProjectListRequest += 1;
        setProjects([]);
        setError(null);
        return [];
      }

      const requestId = ++latestProjectListRequest;
      setLoading(true);
      setError(null);
      console.info("[projects] loading workspace projects");

      try {
        const response = await projectService.getByWorkspace(workspaceId);
        if (requestId === latestProjectListRequest) {
          setProjects(response.data.data);
        }
        console.info("[projects] workspace projects loaded", {
          count: response.data.data.length,
        });
        return response.data.data;
      } catch (requestError) {
        const message = getErrorMessage(requestError);
        if (requestId === latestProjectListRequest) {
          setError(message);
        }
        console.error("[projects] failed to load workspace projects", {
          message,
        });
        throw requestError;
      } finally {
        if (requestId === latestProjectListRequest) {
          setLoading(false);
        }
      }
    },
    [setError, setLoading, setProjects]
  );

  const loadProject = useCallback(
    async (projectId: string) => {
      setLoading(true);
      setError(null);
      setCurrentProject(null);
      console.info("[projects] loading project details");

      try {
        const response = await projectService.getById(projectId);
        setCurrentProject(response.data.data);
        return response.data.data;
      } catch (requestError) {
        const message = getErrorMessage(requestError);
        setError(message);
        console.error("[projects] failed to load project details", {
          message,
        });
        throw requestError;
      } finally {
        setLoading(false);
      }
    },
    [setCurrentProject, setError, setLoading]
  );

  const createProject = useCallback(
    async (data: CreateProjectRequest) => {
      console.info("[projects] creating project");
      const response = await projectService.create(data);
      await loadProjects(data.workspace);
      return response.data.data;
    },
    [loadProjects]
  );

  const updateProject = useCallback(
    async (
      projectId: string,
      workspaceId: string,
      data: UpdateProjectRequest
    ) => {
      console.info("[projects] updating project");
      const response = await projectService.update(projectId, data);
      await loadProjects(workspaceId);
      if (currentProject?._id === projectId) {
        setCurrentProject(response.data.data);
      }
      return response.data.data;
    },
    [currentProject?._id, loadProjects, setCurrentProject]
  );

  const archiveProject = useCallback(
    async (projectId: string, workspaceId: string) => {
      console.info("[projects] archiving project");
      await projectService.archive(projectId);
      await loadProjects(workspaceId);
      if (currentProject?._id === projectId) {
        setCurrentProject(null);
      }
    },
    [currentProject?._id, loadProjects, setCurrentProject]
  );

  return {
    projects,
    currentProject,
    selectedWorkspaceId,
    isLoading,
    error,
    setSelectedWorkspaceId,
    setCurrentProject,
    loadProjects,
    loadProject,
    createProject,
    updateProject,
    archiveProject,
  };
};
