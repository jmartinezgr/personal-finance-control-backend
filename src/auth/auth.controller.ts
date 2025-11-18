import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { setAuthCookies } from './utils/set-auth-cookies.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserPayload: RegisterDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.register(createUserPayload);

    setAuthCookies(res, accessToken, refreshToken);

    return res.json({ message: 'Usuario registrado con éxito' });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    setAuthCookies(res, accessToken, refreshToken);

    return res.json({ message: 'Usuario inició sesión con éxito' });
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'] as string;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token no encontrado' });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.json({ message: 'Tokens actualizados con éxito' });
  }
}
