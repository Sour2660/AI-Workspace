export interface CreateProjectDto {
  name: string;
  description?: string;
  workspace: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}