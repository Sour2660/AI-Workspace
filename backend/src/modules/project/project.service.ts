import AppError from "../../errors/AppError";
import workspaceRepository from "../workspace/workspace.repository";
import projectRepository from "./project.repository";
import {
  CreateProjectDto,
  UpdateProjectDto,
} from "./project.types";

class ProjectService {
  async create(userId: string, data: CreateProjectDto) {
    console.log("service", data);
    const workspace = await workspaceRepository.findById(data.workspace);

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    console.log("service", workspace.members);
    if (!workspace.members.some((member) => member.toString() === userId)) {
      throw new AppError("Access denied", 403);
    }

    console.log("service", data);
    return projectRepository.create({
      ...data,
      owner: userId,
      members: [userId],
    });
  }

  async findAll(workspaceId: string) {
    console.log("service", workspaceId);
    return projectRepository.findByWorkspace(workspaceId);
  }

  async findById(id: string) {
    console.log("service", id);
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return project;
  }

  async update(id: string, data: UpdateProjectDto) {
    await this.findById(id);

    return projectRepository.update(id, data);
  }

  async archive(id: string) {
    await this.findById(id);

    return projectRepository.archive(id);
  }
}

export default new ProjectService();