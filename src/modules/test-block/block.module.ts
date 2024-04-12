import { Module } from '@nestjs/common';
import { BlockController } from './block.controller';
import { TestBlockService } from './block.service';
import { PrismaService } from 'nestjs-prisma';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  controllers: [BlockController],
  providers: [TestBlockService, PrismaService, JwtStrategy],
})
export class BlockModule {}
