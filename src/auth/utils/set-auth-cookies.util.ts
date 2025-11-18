import { Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    maxAge: 15 * 60 * 1000,
    sameSite: isProd ? 'strict' : 'lax',
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    sameSite: isProd ? 'strict' : 'lax',
  });
}
