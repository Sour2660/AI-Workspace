import AppError from "../../errors/AppError";
import projectRepository from "../project/project.repository";
import taskRepository from "./task.repository";
import { CreateTaskDto, UpdateTaskDto } from "./task.types";

class TaskService {
  async create(userId: string, data: CreateTaskDto) {
    const project = await projectRepository.findById(data.project);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return taskRepository.create({
      ...data,
      reporter: userId,
    });
  }

  async findAll(projectId: string) {
    return taskRepository.findByProject(projectId);
  }

  async findById(id: string) {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return task;
  }

  async update(id: string, data: UpdateTaskDto) {
    await this.findById(id);

    return taskRepository.update(id, data);
  }

  async updateStatus(id: string, status: string) {
    await this.findById(id);

    return taskRepository.update(id, {
      status,
    });
  }

  async delete(id: string) {
    await this.findById(id);

    return taskRepository.delete(id);
  }
}

export default new TaskService();