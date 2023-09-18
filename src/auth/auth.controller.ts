import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from '../dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiTags('Auth')
  async register(@Body() registerUserBody: RegisterUserDto) {
    return await this.authService.register(registerUserBody);
  }
  @Post('login')
  @ApiTags('Auth')
  async login(@Body() loginUser: LoginUserDto) {
    return await this.authService.login(loginUser);
  }
  @Post('refresh-token')
  @ApiTags('Auth')
  async refreshToken(@Body() refresh: { refresh_token: string }) {
    const { refresh_token } = refresh;
    return await this.authService.refreshToken(refresh_token);
  }
}
