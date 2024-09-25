import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { ProjectService } from './project.service';
import type { ProjectDocument } from './schemas/project.schema';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async add(@Body() addProjectDto: { url: string }): Promise<ProjectDocument> {
    return this.projectService.add(addProjectDto.url);
  }

  @Get('all')
  async findAll(): Promise<ProjectDocument[]> {
    return this.projectService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') projectId: string): Promise<void> {
    return this.projectService.delete(projectId);
  }

  @Put(':id')
  async update(
    @Param('id') projectId: string,
    @Body() updateProjectDto: { url: string },
  ): Promise<ProjectDocument> {
    return this.projectService.update(projectId, updateProjectDto.url);
  }
}
