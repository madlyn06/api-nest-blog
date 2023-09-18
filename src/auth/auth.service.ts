import { hashPassword } from './../utills/utill';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entity/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterUserDto } from '../dto/user.dto';
import * as brycpt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(registerUser: RegisterUserDto) {
    const email_exist = await this.userRepository.findOne({
      where: { email: registerUser.email },
    });
    if (email_exist) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }
    const hash_password = hashPassword(registerUser.password);
    const user = await this.userRepository.save({
      ...registerUser,
      password: hash_password,
    });
    const { access_token, refresh_token } = await this.generateToken({
      id: user.id,
      email: user.email,
    });
    await this.userRepository.update({ id: user.id }, { refresh_token });
    return { access_token, refresh_token };
  }
  async login(loginUser: LoginUserDto) {
    const { email, password } = loginUser;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const match = brycpt.compareSync(password, user.password);
    if (!match) {
      throw new HttpException('Password incorrect', HttpStatus.UNAUTHORIZED);
    }
    const { access_token, refresh_token } = await this.generateToken({
      id: user.id,
      email: user.email,
    });
    await this.userRepository.update({ id: user.id }, { refresh_token });
    return { access_token, refresh_token };
  }
  async refreshToken(refresh_token: string) {
    try {
      const { id, email } = this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('SECRET'),
      });
      const user = await this.userRepository.findOne({ where: { id, email } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const token = await this.generateToken({
        id: user.id,
        email: user.email,
      });
      await this.userRepository.update({ id: user.id }, { refresh_token });
      return token;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
  private async generateToken(payload: { id: number; email: string }) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('EXPIRES_IN'),
      secret: this.configService.get<string>('SECRET'),
    });
    return { access_token, refresh_token };
  }
}
