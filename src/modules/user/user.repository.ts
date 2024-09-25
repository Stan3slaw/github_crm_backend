import { Injectable } from '@nestjs/common';

import type { Knex } from 'knex';

import { KnexService } from '../../common/database/knex/knex.service';
import type { UserEntity } from './entities/user.entity';
import type { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(
    createUserDto: CreateUserDto,
    trx?: Knex.Transaction<unknown, unknown[]>,
  ): Promise<UserEntity> {
    const knex = trx ?? this.knexService.getKnex();
    const [createdUser] = await knex('users')
      .insert(createUserDto)
      .returning('*');

    return createdUser;
  }

  async findOneByEmail(
    email: string,
    trx?: Knex.Transaction<unknown, unknown[]>,
  ): Promise<UserEntity> {
    const knex = trx ?? this.knexService.getKnex();
    const foundUser = await knex('users').first<UserEntity>().where({ email });

    return foundUser;
  }
}
