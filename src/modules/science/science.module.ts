import { Module } from '@nestjs/common';
import { ScienceController } from './science.controller';
import { ScienceService } from './science.service';
import { PrismaService } from 'nestjs-prisma';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  controllers: [ScienceController],
  providers: [ScienceService, PrismaService, JwtStrategy],
})
export class ScienceModule {}
