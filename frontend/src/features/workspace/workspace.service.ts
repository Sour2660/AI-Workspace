import api from "@/services/api";

import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceListResponse,
  WorkspaceResponse,
} from "@/types/workspace";

class WorkspaceService {
  async getAll() {
    return api.get<WorkspaceListResponse>("/workspaces");
  }

  async getById(id: string) {
    return api.get<WorkspaceResponse>(`/workspaces/${id}`);
  }

  async create(data: CreateWorkspaceRequest) {
    return api.post<WorkspaceResponse>("/workspaces", data);
  }

  async update(id: string, data: UpdateWorkspaceRequest) {
    return api.put<WorkspaceResponse>(`/workspaces/${id}`, data);
  }

  async archive(id: string) {
    return api.patch(`/workspaces/${id}/archive`);
  }
}

export default new WorkspaceService();