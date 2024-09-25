import { Injectable } from '@nestjs/common';

import type { GithubRepositoryEntity } from './entities/github-repository.entity';
import { GithubApiProxyService } from './github-api-proxy.service';
import type { GithubRepository } from './interfaces/github-repository.interface';

@Injectable()
export class GithubApiService {
  constructor(private readonly proxy: GithubApiProxyService) {}

  private static async mapGithubRepositoryEntityToGithubRepository(
    githubRepositoryEntity: GithubRepositoryEntity,
  ): Promise<GithubRepository> {
    return {
      owner: githubRepositoryEntity.owner.login,
      name: githubRepositoryEntity.name,
      url: githubRepositoryEntity.html_url,
      starsNumber: githubRepositoryEntity.stargazers_count,
      forksNumber: githubRepositoryEntity.forks_count,
      issuesNumber: githubRepositoryEntity.open_issues_count,
      createdAt: new Date(githubRepositoryEntity.created_at).getTime() / 1000,
    };
  }

  getRepository(url: string): Promise<GithubRepository> {
    return this.proxy
      .request<GithubRepositoryEntity>({
        url: `/${url}`,
        method: 'GET',
      })
      .then((response) =>
        GithubApiService.mapGithubRepositoryEntityToGithubRepository(response),
      );
  }
}
