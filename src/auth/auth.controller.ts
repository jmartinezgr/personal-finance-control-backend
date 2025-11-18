import { Body, Controller, Post, Res } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserPayload: RegisterDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.register(createUserPayload);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 minutos
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });

    return res.json({ message: 'User registered successfully' });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15 minutos
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });
    return res.json({ message: 'User logged in successfully' });
  }
}
