import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { mongooseConfig } from './common/database/mongoose/mongoose.config';
import { KnexModule } from './common/database/knex/knex.module';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL, mongooseConfig),
    KnexModule,
    AuthModule,
    UserModule,
    ProjectModule,
  ],
})
export class AppModule {}
