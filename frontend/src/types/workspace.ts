export type Workspace = {
  _id: string;
  name: string;
  description: string;
  color: string;
  owner: string;
  members: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateWorkspaceRequest = {
  name: string;
  description: string;
  color: string;
};

export type UpdateWorkspaceRequest = {
  name?: string;
  description?: string;
  color?: string;
};

export type WorkspaceResponse = {
  success: boolean;
  message: string;
  data: Workspace;
};

export type WorkspaceListResponse = {
  success: boolean;
  message: string;
  data: Workspace[];
};