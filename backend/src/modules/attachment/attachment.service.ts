import AppError from "../../errors/AppError";
import taskRepository from "../task/task.repository";
import attachmentRepository from "./attachment.repository";

class AttachmentService {
  async upload(userId: string, taskId: string, file: Express.Multer.File) {
    const task = await taskRepository.findById(taskId);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return attachmentRepository.create({
      task: taskId,
      uploadedBy: userId,
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
    });
  }

  async findAll(taskId: string) {
    console.log("taskId", taskId);
    return attachmentRepository.findByTask(taskId);
  }

  async delete(id: string) {
    console.log("id", id);
    const attachment = await attachmentRepository.findById(id);

    if (!attachment) {
      throw new AppError("Attachment not found", 404);
    }

    return attachmentRepository.delete(id);
  }
}

export default new AttachmentService();