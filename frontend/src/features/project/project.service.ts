import api from "@/services/api";
import type {
  CreateProjectRequest,
  ProjectListResponse,
  ProjectResponse,
  UpdateProjectRequest,
} from "@/features/project/types";

class ProjectService {
  getByWorkspace(workspaceId: string) {
    return api.get<ProjectListResponse>(
      `/projects/workspace/${workspaceId}`
    );
  }

  getById(projectId: string) {
    return api.get<ProjectResponse>(`/projects/${projectId}`);
  }

  create(data: CreateProjectRequest) {
    return api.post<ProjectResponse>("/projects", data);
  }

  update(projectId: string, data: UpdateProjectRequest) {
    return api.put<ProjectResponse>(`/projects/${projectId}`, data);
  }

  archive(projectId: string) {
    return api.delete<ProjectResponse>(`/projects/${projectId}`);
  }
}

export default new ProjectService();
