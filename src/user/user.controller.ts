import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilterUserDto } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiTags('User')
  async findAllUser(@Query() query: FilterUserDto) {
    const limit = Number(query.limit);
    const page = Number(query.page);
    const result = await this.userService.findAll({ page, limit });
    return {
      message: 'Find all user success!',
      result,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiTags('User')
  findOneUser(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiTags('User')
  create(@Body() user) {
    return this.userService.create(user);
  }

  @Post('upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
