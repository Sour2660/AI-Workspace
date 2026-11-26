export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export type Project = {
  _id: string;
  name: string;
  description?: string;
  workspace: string | { _id: string; name: string };
  owner: string | { _id: string; name: string; email: string };
  members: Array<string | { _id: string; name?: string; email?: string }>;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectRequest = {
  name: string;
  description?: string;
  workspace: string;
};

export type UpdateProjectRequest = {
  name?: string;
  description?: string;
};

export type ProjectResponse = {
  success: boolean;
  message: string;
  data: Project;
};

export type ProjectListResponse = {
  success: boolean;
  message: string;
  data: Project[];
};
