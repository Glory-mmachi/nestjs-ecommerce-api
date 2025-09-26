import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/signUp.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        success: 'success',
        message: 'Signup successfully',
        data: {
          id: 'uuid',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User already exists',
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    const { access_token, user: data } =
      await this.authService.signUp(signUpDto);
    return {
      success: 'success',
      message: 'Signup successfull',
      access_token,
      data,
    };
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete('delete')
  async delete(@Req() req: Request) {
    console.log('User from req:', req['user']);
    const { sub } = req['user'];
    await this.authService.delete(sub);
    return {
      success: 'success',
      message: 'Delete successfull',
    };
  }
}
