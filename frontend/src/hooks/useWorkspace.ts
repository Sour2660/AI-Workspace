import { useCallback } from "react";
import workspaceService from "@/features/workspace/workspace.service";
import { useWorkspaceStore } from "@/store/workspace.store";

import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from "@/types/workspace";

export const useWorkspace = () => {
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const currentWorkspace = useWorkspaceStore(
    (state) => state.currentWorkspace
  );
  const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces);
  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace
  );

  const getAll = useCallback(async () => {
    const res = await workspaceService.getAll();
    setWorkspaces(res.data.data);
    return res.data.data;
  }, [setWorkspaces]);

  const getById = useCallback(async (id: string) => {
    const res = await workspaceService.getById(id);
    setCurrentWorkspace(res.data.data);
    return res.data.data;
  }, [setCurrentWorkspace]);

  const create = useCallback(async (data: CreateWorkspaceRequest) => {
    const res = await workspaceService.create(data);
    await getAll();
    return res.data.data;
  }, [getAll]);

  const update = useCallback(async (
    id: string,
    data: UpdateWorkspaceRequest
  ) => {
    const res = await workspaceService.update(id, data);
    await getAll();
    return res.data.data;
  }, [getAll]);

  const archive = useCallback(async (id: string) => {
    await workspaceService.archive(id);
    await getAll();
  }, [getAll]);

  return {
    workspaces,
    currentWorkspace,
    getAll,
    getById,
    create,
    update,
    archive,
  };
};