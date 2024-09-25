import { Module } from '@nestjs/common';

import { LoggerModule } from '../../logger/logger.module';
import { KnexService } from './knex.service';

@Module({
  imports: [LoggerModule],
  providers: [KnexService],
  exports: [KnexService],
})
export class KnexModule {}
