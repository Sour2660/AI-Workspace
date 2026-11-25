import Project from "../../models/project.model";

class ProjectRepository {
  create(data: any) {
    return Project.create(data);
  }

  findById(id: string) {
    return Project.findById(id)
      .populate("workspace")
      .populate("owner", "-password");
  }

  findByWorkspace(workspaceId: string) {
    return Project.find({
      workspace: workspaceId,
      status: "ACTIVE",
    });
  }

  update(id: string, data: any) {
    return Project.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  archive(id: string) {
    return Project.findByIdAndUpdate(
      id,
      {
        status: "ARCHIVED",
      },
      {
        new: true,
      }
    );
  }
}

export default new ProjectRepository();