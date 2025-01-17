/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { AxiosResponse, Method } from 'axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

import { Logger } from '../../logger/logger.service';

@Injectable()
export class GithubApiProxyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(GithubApiProxyService.name);
  }

  async request<T = any>({
    url,
    method,
    params,
    body,
  }: {
    url: string;
    method: Method;
    params?: any;
    body?: any;
  }): Promise<T> {
    const response = await this.sendRequest(url, method, params, body);

    if (this.configService.get<boolean>('IS_DEV_MODE') && body) {
      this.logger.warn(`Request body`, body);
    }

    this.logger.log(
      `[${response.config.method}] [${response.config.url}] : ` +
        response.status +
        ' ' +
        response.statusText,
    );
    if (this.configService.get<boolean>('IS_VERBOSE_MODE')) {
      this.logger.warn(`Response body`, response.data);
    }

    return response.data;
  }

  private async sendRequest(
    url: string,
    method: Method,
    params: any,
    body: any,
  ): Promise<AxiosResponse<any, any>> {
    try {
      return await lastValueFrom(
        this.httpService.request({
          url: this.configService.get<string>('BASE_URL') + url,
          data: body,
          params,
          method,
          headers: { 'X-GitHub-Api-Version': '2022-11-28' },
        }),
      );
    } catch (error) {
      this.logger.error(
        `[${method}] [${url}] : ${HttpStatus.BAD_REQUEST} ${
          error.message || 'Unable to send a request'
        }`,
      );

      switch (error.status) {
        case HttpStatus.NOT_FOUND:
          throw new NotFoundException('Requested resource not found');
        case HttpStatus.INTERNAL_SERVER_ERROR:
          throw new InternalServerErrorException(
            'GitHub API is experiencing issues',
          );
        default:
          throw new BadRequestException('Unable to send a request');
      }
    }
  }
}
