import type { Document } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  starsNumber: number;

  @Prop({ required: true })
  forksNumber: number;

  @Prop({ required: true })
  issuesNumber: number;

  @Prop({ required: true })
  createdAt: number;
}

const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({});

export { ProjectSchema };
