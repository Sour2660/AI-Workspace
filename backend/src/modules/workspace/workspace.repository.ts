import Workspace from "../../models/workspace.model";

class WorkspaceRepository {
  create(data: any) {
    return Workspace.create(data);
  }

  findAllByUser(userId: string) {
    return Workspace.find({
      members: userId,
      isArchived: false,
    }).sort({ createdAt: -1 });
  }

  findById(id: string) {
    return Workspace.findById(id);
  }

  update(id: string, data: any) {
    return Workspace.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  archive(id: string) {
    return Workspace.findByIdAndUpdate(
      id,
      {
        isArchived: true,
      },
      {
        new: true,
      }
    );
  }
}

export default new WorkspaceRepository();