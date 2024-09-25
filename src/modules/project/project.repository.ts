import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import type { ProjectDocument } from './schemas/project.schema';
import { Project } from './schemas/project.schema';
import type { AddUpdateProjectDto } from './dtos/add-project.dto';

@Injectable()
export class ProjectRepository {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async add(addProjectDto: AddUpdateProjectDto): Promise<ProjectDocument> {
    const project = new this.projectModel(addProjectDto);
    const savedProject = await project.save();

    return savedProject;
  }

  async findAll(): Promise<ProjectDocument[]> {
    const foundProjects = await this.projectModel.find();

    return foundProjects;
  }

  async findOneByUrl(url: string): Promise<ProjectDocument> {
    const owner = url.split('/')[0];
    const projectName = url.split('/')[1];

    const foundProject = await this.projectModel.findOne({
      owner: new RegExp(`^${owner}$`, 'i'),
      name: new RegExp(`^${projectName}$`, 'i'),
    });

    return foundProject;
  }

  async delete(projectId: string): Promise<void> {
    await this.projectModel.deleteOne({ _id: projectId });
  }

  async update(
    projectId: string,
    updateProjectDto: AddUpdateProjectDto,
  ): Promise<ProjectDocument> {
    const updatedProject = await this.projectModel.findOneAndUpdate(
      { _id: projectId },
      updateProjectDto,
      { new: true },
    );

    return updatedProject;
  }
}
