import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async users() {
    const data = await this.userService.users();
    return { data };
  }

  @Get(':userId')
  user(@Param('userId') userId: string): Promise<User> {
    return this.userService.user(parseInt(userId, 10));
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard)
  async partialUpdate(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: UpdateUserDto,
    @Req() req: Request,
  ) {
    const data = await this.userService.update(userId, body, +req['user'].id);
    return { data };
  }
}
