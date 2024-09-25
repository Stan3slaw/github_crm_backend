import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { UserRepository } from './user.repository';
import type { CreateUserDto } from './dtos/create-user.dto';
import type { UserResponseDto } from './dtos/user-response.dto';
import type { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private static async mapUserEntityToUserResponseDto(
    userEntity: UserEntity,
  ): Promise<UserResponseDto> {
    return {
      id: userEntity.id,
      email: userEntity.email,
      password: userEntity.password,
      createdAt: userEntity.created_at,
      updatedAt: userEntity.updated_at,
    };
  }

  async findOneByEmail(email: string): Promise<UserResponseDto> {
    const foundUser = await this.userRepository.findOneByEmail(email);

    if (!foundUser) {
      return null;
    }

    const mappedUserToUserResponseDto =
      UserService.mapUserEntityToUserResponseDto(foundUser);

    return mappedUserToUserResponseDto;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const foundUser = await this.userRepository.findOneByEmail(
      createUserDto.email,
    );

    if (foundUser) {
      throw new ConflictException('Email already in use');
    }

    const createdUser = await this.userRepository.create(createUserDto);

    const mappedUserToUserResponseDto =
      UserService.mapUserEntityToUserResponseDto(createdUser);

    return mappedUserToUserResponseDto;
  }
}
