import AppError from "../../errors/AppError";
import workspaceRepository from "./workspace.repository";
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from "./workspace.types";

class WorkspaceService {
  async create(userId: string, data: CreateWorkspaceDto) {
    return workspaceRepository.create({
      ...data,
      owner: userId,
      members: [userId],
    });
  }

  async findAll(userId: string) {
    return workspaceRepository.findAllByUser(userId);
  }

  async findById(id: string, userId: string) {
    const workspace = await workspaceRepository.findById(id);

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    if (!workspace.members.some((member) => member.toString() === userId)) {
      throw new AppError("Access denied", 403);
    }

    return workspace;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateWorkspaceDto
  ) {
    await this.findById(id, userId);

    return workspaceRepository.update(id, data);
  }

  async archive(id: string, userId: string) {
    await this.findById(id, userId);

    return workspaceRepository.archive(id);
  }
}

export default new WorkspaceService();