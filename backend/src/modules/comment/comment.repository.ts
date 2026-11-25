import Comment from "../../models/comment.model";

class CommentRepository {
  create(data: any) {
    return Comment.create(data);
  }

  findByTask(taskId: string) {
    return Comment.find({
      task: taskId,
    })
      .populate("user", "-password")
      .sort({
        createdAt: 1,
      });
  }

  findById(id: string) {
    return Comment.findById(id);
  }

  update(id: string, data: any) {
    return Comment.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  delete(id: string) {
    return Comment.findByIdAndDelete(id);
  }
}

export default new CommentRepository();