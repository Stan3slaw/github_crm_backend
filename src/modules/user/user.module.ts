import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { KnexModule } from '../../common/database/knex/knex.module';

@Module({
  imports: [KnexModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
