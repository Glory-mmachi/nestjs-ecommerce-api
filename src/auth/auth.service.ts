import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signUp.dto';
import { getPasswordHash } from 'src/utils/hashPassword';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    //find user
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signUpDto.email },
    });

    //check if email exists
    if (existingUser) {
      throw new ConflictException(
        `User with this email ${existingUser.email} already exists`,
      );
    }

    //hash password
    const hash = await getPasswordHash(signUpDto.password);

    const user = await this.prisma.user.create({
      data: {
        ...signUpDto,
        password: {
          create: {
            hash,
          },
        },
      },
    });
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }
  async login(loginDto: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: { password: true },
    });
    if (!existingUser || !existingUser.password) {
      throw new ForbiddenException('Invalid credentials');
    }
  }
  async delete(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
  }
}
