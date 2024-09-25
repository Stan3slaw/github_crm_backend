import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import type { AuthPayload } from '../types/auth.types';
import { accessTokenCookieExtractor } from '../utils/access-token-cookie-extractor.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: accessTokenCookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secret'),
    });
  }

  validate = async ({ id, email }: AuthPayload): Promise<AuthPayload> => {
    return { id, email };
  };
}
