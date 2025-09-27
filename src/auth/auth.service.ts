import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signUp.dto';
import { comparePasswordHash, getPasswordHash } from 'src/utils/hashPassword';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: SignUpDto) {
    try {
      //find user
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      //check if email exists
      if (existingUser) {
        throw new ConflictException(
          `User with this email ${existingUser.email} already exists`,
        );
      }

      //hash password
      const hash = await getPasswordHash(data.password);

      //create user
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: {
            create: {
              hash,
            },
          },
        },
      });
      //set jwt payload
      const payload = { sub: user.id, email: user.email, role: user.role };

      //send access token and user info
      return {
        access_token: await this.jwtService.signAsync(payload),
        user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Signup failed. Please try again.',
      );
    }
  }

  async login(data: LoginDto) {
    try {
      //Find user
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
        include: { password: true },
      });

      //If no user, throw an error
      if (!user || !user.password) {
        throw new ForbiddenException('Invalid credentials');
      }

      //compare password
      const isPasswordValid = await comparePasswordHash(
        data.password,
        user.password.hash,
      );
      if (!data.password || !isPasswordValid) {
        throw new BadRequestException(`Incorrect credentials`);
      }

      //set jwt payload
      const payload = { sub: user.id, email: user.email, role: user.role };
      const access_token = await this.jwtService.signAsync(payload);

      const userData: LoginResponseDto = {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        access_token: access_token,
      };
      //send access token and user info
      return userData;
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(`Login failed, please try again`);
    }
  }

  async delete(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
  }
}
