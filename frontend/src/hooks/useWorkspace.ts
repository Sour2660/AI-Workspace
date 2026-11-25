import workspaceService from "@/features/workspace/workspace.service";
import { useWorkspaceStore } from "@/store/workspace.store";

import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from "@/types/workspace";

export const useWorkspace = () => {
  const store = useWorkspaceStore();

  const getAll = async () => {
    const res = await workspaceService.getAll();
    store.setWorkspaces(res.data.data);
    return res.data.data;
  };

  console.log("useWorkspace Hook Loaded");

  const getById = async (id: string) => {
    const res = await workspaceService.getById(id);
    store.setCurrentWorkspace(res.data.data);
    return res.data.data;
  };

  const create = async (data: CreateWorkspaceRequest) => {
    const res = await workspaceService.create(data);
    await getAll();
    return res.data.data;
  };

  const update = async (
    id: string,
    data: UpdateWorkspaceRequest
  ) => {
    const res = await workspaceService.update(id, data);
    await getAll();
    return res.data.data;
  };

  const archive = async (id: string) => {
    await workspaceService.archive(id);
    await getAll();
  };

  return {
    ...store,
    getAll,
    getById,
    create,
    update,
    archive,
  };
};