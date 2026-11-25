import Task from "../../models/task.model";

class TaskRepository {
  create(data: any) {
    return Task.create(data);
  }

  findById(id: string) {
    return Task.findById(id)
      .populate("assignee", "-password")
      .populate("reporter", "-password")
      .populate("project");
  }

  findByProject(projectId: string) {
    return Task.find({
      project: projectId,
    })
      .populate("assignee", "-password")
      .populate("reporter", "-password");
  }

  update(id: string, data: any) {
    return Task.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  delete(id: string) {
    return Task.findByIdAndDelete(id);
  }
}

export default new TaskRepository();