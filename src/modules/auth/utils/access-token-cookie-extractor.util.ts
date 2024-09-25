import type { Request } from 'express';

export function accessTokenCookieExtractor(request: Request): string {
  let accessToken = null;

  if (request && request.cookies && request.cookies['access-token']) {
    accessToken = request.cookies['access-token'];
  } else if (request && request.headers.authorization) {
    accessToken = request.headers.authorization;
  }

  return accessToken;
}
