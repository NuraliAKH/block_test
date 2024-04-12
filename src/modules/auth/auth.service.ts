import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { SignUpDto, SignInDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@/src/lib/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const { contact, username, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        contact,
        username,
        password: hashedPassword,
        roles: {
          connect: [{ name: Role.User }],
        },
      },
    });

    const payload = { contact: user.contact, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      body: { message: 'Пользователь успешно создан.' },
      cookie: token,
      cookieOptions: {
        httpOnly: true,
      },
    };
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    const { contact, password } = signInDto;
    const user = await this.prismaService.user.findUnique({
      where: { contact },
    });

    if (!user) {
      throw new HttpException(
        'Пользователь не найден',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new HttpException(
        'Неверные учетные данные',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { contact: user.contact, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      body: { message: 'Аутентификация успешна.' },
      cookie: token,
      cookieOptions: {
        httpOnly: true,
      },
    };
  }

  async refreshToken(user: any): Promise<any> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id: user.sub },
    });

    if (!existingUser) {
      throw new HttpException(
        'Пользователь не найден',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { contact: existingUser.contact, sub: existingUser.id };
    const newToken = this.jwtService.sign(payload);

    return {
      cookie: newToken,
      cookieOptions: {
        httpOnly: true,
      },
    };
  }

  async validateUser(contact: string, pass: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { contact },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getUserProfile(userId: number): Promise<{
    contact: string;
    username: string;
    roles: {
      id: number;
      name: string;
    }[];
  }> {
    return this.prismaService.user.findFirstOrThrow({
      where: { id: userId },
      select: { id: true, contact: true, username: true, roles: true },
    });
  }

  async connectRole(userId: number, roleName: string): Promise<any> {
    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        roles: {
          connect: { name: roleName },
        },
      },
      select: { id: true, contact: true, username: true, roles: true },
    });
  }

  async disconnectRole(userId: number, roleName: string) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        roles: {
          disconnect: { name: roleName },
        },
      },
      select: { id: true, contact: true, username: true, roles: true },
    });
  }
}
