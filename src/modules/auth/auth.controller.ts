import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './auth.dto';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { ConnectRoleDto } from './dto/role-connect.dto';
import { DisconnectRoleDto } from './dto/role-disconnect.dto';
import { Roles } from './roles.decorator';
import { Role } from '@/src/lib/enums/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signUp(signUpDto);
    response.cookie('Authentication', result.cookie, result.cookieOptions);
    return result.body;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { cookie, cookieOptions, body } =
      await this.authService.signIn(signInDto);
    response.cookie('Authentication', cookie, cookieOptions);
    return body;
  }

  @Post('signout')
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('Authentication');
    response.status(HttpStatus.NO_CONTENT);
    return { message: 'Вы успешно вышли из системы.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { cookie, cookieOptions, body } = await this.authService.refreshToken(
      req['user'],
    );
    response.cookie('Authentication', cookie, cookieOptions);
    return body;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: Request) {
    const user = await this.authService.getUserProfile(req['user'].id);
    return { data: user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('role/connect')
  @Roles(Role.Manager)
  async connectRole(@Body() body: ConnectRoleDto) {
    const data = await this.authService.connectRole(body.userId, body.roleName);
    return { data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('role/disconnect')
  async disconnectRole(@Body() body: DisconnectRoleDto) {
    const data = await this.authService.disconnectRole(
      body.userId,
      body.roleName,
    );
    return { data };
  }
}
