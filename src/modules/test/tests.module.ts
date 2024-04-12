import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [TestController],
  providers: [TestService, PrismaService],
})
export class TestModule {}
