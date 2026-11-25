import AppError from "../../errors/AppError";
import taskRepository from "../task/task.repository";
import commentRepository from "./comment.repository";
import { CreateCommentDto, UpdateCommentDto } from "./comment.types";

class CommentService {
  async create(userId: string, data: CreateCommentDto) {
    const task = await taskRepository.findById(data.task);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return commentRepository.create({
      ...data,
      user: userId,
    });
  }

  async findAll(taskId: string) {
    return commentRepository.findByTask(taskId);
  }

  async update(id: string, data: UpdateCommentDto) {
    const comment = await commentRepository.findById(id);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    return commentRepository.update(id, data);
  }

  async delete(id: string) {
    const comment = await commentRepository.findById(id);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    return commentRepository.delete(id);
  }
}

export default new CommentService();