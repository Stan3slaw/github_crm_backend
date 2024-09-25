import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ConfigService } from '@nestjs/config';

import { GithubApiProxyService } from './github-api-proxy.service';
import { GithubApiService } from './github-api.service';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [HttpModule, LoggerModule],
  providers: [GithubApiProxyService, GithubApiService, ConfigService],
  exports: [GithubApiService],
})
export class GithubApiModule {}
