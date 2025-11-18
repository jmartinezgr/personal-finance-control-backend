import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async register(payload: RegisterDto) {
    let user: User | null = null;
    try {
      const pre_user = await this.userService.findByEmail(payload.email);
      if (pre_user) {
        throw new BadRequestException('User already exists');
      }

      const hashed = await bcrypt.hash(payload.password, 10);
      user = await this.userService.create({
        ...payload,
        password: hashed,
      });

      const accessToken = this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
        },
        {
          expiresIn: '15m',
        },
      );

      const refreshToken = this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
        },
        {
          expiresIn: '7d',
        },
      );

      this.logger.log('Registered user:', user);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error('Error registering user:', error);
      if (user) {
        this.logger.log('Deleting user due to registration error:', user);
        await this.userService.deleteById(user.id);
      }
      throw error;
    }
  }

  async login(payload: LoginDto) {
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales Invalidas');
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
      },
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload: { email: string; id: string } =
        this.jwtService.verify(refreshToken);
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
        },
        {
          expiresIn: '15m',
        },
      );
      const newRefreshToken = this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
        },
        {
          expiresIn: '7d',
        },
      );
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
