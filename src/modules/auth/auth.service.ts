import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { verify, hash } from 'argon2';

import type { Response } from 'express';

import { UserService } from '../user/user.service';
import type { SignUpSignInDto } from './dtos/sign-up-sign-in.dto';

import { COOKIE_DOMAIN } from '../../common/config/cookie.config';
import type { GetCurrentUserResponseDto } from './dtos/get-current-user-response.dto';
import type { UserResponseDto } from '../user/dtos/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpSignInDto, response: Response): Promise<void> {
    const existingUser = await this.userService.findOneByEmail(signUpDto.email);

    if (existingUser) {
      throw new ConflictException('Email is already taken');
    }

    const hashedPassword = await hash(signUpDto.password);

    const { id: userId, email } = await this.userService.create({
      ...signUpDto,
      password: hashedPassword,
    });

    const accessToken = await this.jwtService.signAsync({
      id: userId,
      email,
    });

    response.cookie('access-token', accessToken, {
      domain: COOKIE_DOMAIN,
      path: '/',
      secure: false,
      httpOnly: true,
      sameSite: false,
    });
  }

  async signIn(signInDto: SignUpSignInDto, response: Response): Promise<void> {
    const user = await this.validateUser(signInDto.email, signInDto.password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { id: userId, email } = user;

    const accessToken = await this.jwtService.signAsync({
      id: userId,
      email,
    });

    response.cookie('access-token', accessToken, {
      domain: COOKIE_DOMAIN,
      path: '/',
      secure: false,
      httpOnly: true,
      sameSite: false,
    });
  }

  async signOut(response: Response): Promise<void> {
    response.clearCookie('access-token', {
      domain: COOKIE_DOMAIN,
      path: '/',
      secure: false,
      httpOnly: true,
      sameSite: false,
    });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User email, or password is incorrect');
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new BadRequestException('User email, or password is incorrect');
    }

    return user;
  }

  async getCurrentUser(userEmail: string): Promise<GetCurrentUserResponseDto> {
    const user = await this.userService.findOneByEmail(userEmail);

    if (!user) {
      throw new UnauthorizedException();
    }
    const { id, email } = user;

    return { id, email };
  }
}
