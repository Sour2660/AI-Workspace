import Attachment from "../../models/attachment.model";

class AttachmentRepository {
  create(data: any) {
    return Attachment.create(data);
  }

  findByTask(taskId: string) {
    return Attachment.find({
      task: taskId,
    }).populate("uploadedBy", "name email");
  }

  findById(id: string) {
    return Attachment.findById(id);
  }

  delete(id: string) {
    return Attachment.findByIdAndDelete(id);
  }
}

export default new AttachmentRepository();