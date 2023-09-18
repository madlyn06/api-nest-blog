import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private JwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Loi roi ban oi');
    }
    const access_token = request.headers.authorization.split(' ')[1];
    try {
      const user = await this.JwtService.verifyAsync(access_token, {
        secret: this.configService.get<string>('SECRET'),
      });
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
