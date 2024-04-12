import { Module } from '@nestjs/common';
import { UserTestController } from './test.controller';
import { UserTestService } from './test.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [UserTestController],
  providers: [UserTestService, PrismaService],
})
export class UserTestModule {}
