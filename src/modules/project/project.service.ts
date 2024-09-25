import { ConflictException, Injectable } from '@nestjs/common';

import type { ProjectDocument } from './schemas/project.schema';
import { ProjectRepository } from './project.repository';
import { GithubApiService } from '../../common/apis/github-api/github-api.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly githubApiService: GithubApiService,
  ) {}

  async add(url: string): Promise<ProjectDocument> {
    const foundProject = await this.projectRepository.findOneByUrl(url);

    if (foundProject) {
      throw new ConflictException('Project already exists');
    }

    const project = await this.githubApiService.getRepository(url);

    const addedProject = await this.projectRepository.add(project);

    return addedProject;
  }

  async findAll(): Promise<ProjectDocument[]> {
    const foundProjects = await this.projectRepository.findAll();

    return foundProjects;
  }

  async delete(projectId: string): Promise<void> {
    await this.projectRepository.delete(projectId);
  }

  async update(projectId: string, url: string): Promise<ProjectDocument> {
    const refreshedProject = await this.githubApiService.getRepository(url);

    const updatedProject = await this.projectRepository.update(
      projectId,
      refreshedProject,
    );

    return updatedProject;
  }
}
