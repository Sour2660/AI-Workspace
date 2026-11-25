export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateWorkspaceDto {
  name?: string;
  description?: string;
  color?: string;
}