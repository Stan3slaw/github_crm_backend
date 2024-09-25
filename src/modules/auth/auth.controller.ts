import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Res,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { Response } from 'express';

import { SignUpSignInDto } from './dtos/sign-up-sign-in.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import type { AuthPayload } from './types/auth.types';
import type { GetCurrentUserResponseDto } from './dtos/get-current-user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body() signUpDto: SignUpSignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    return this.authService.signUp(signUpDto, response);
  }

  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignUpSignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    return this.authService.signIn(signInDto, response);
  }

  @Post('sign-out')
  async signOut(@Res({ passthrough: true }) response: Response): Promise<void> {
    return this.authService.signOut(response);
  }

  @UseGuards(JwtGuard)
  @Get('check-auth')
  async checkAuth(): Promise<{ isAuth: true }> {
    return { isAuth: true };
  }

  @UseGuards(JwtGuard)
  @Post('current-user')
  async getCurrentUser(
    @Request() req: ExpressRequest & { user: AuthPayload },
  ): Promise<GetCurrentUserResponseDto> {
    return this.authService.getCurrentUser(req.user.email);
  }
}
