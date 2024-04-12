import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TestBlockService {
  constructor(private prismaService: PrismaService) {}

  create(testBlock: any) {
    return this.prismaService.testBlock.create({
      data: testBlock,
    });
  }

  findAll() {
    return this.prismaService.testBlock.findMany({
      include: {
        sciences: true,
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.testBlock.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, testBlock: any) {
    return this.prismaService.testBlock.update({
      where: { id },
      data: testBlock,
    });
  }

  partialUpdate(id: number, testBlock: any) {
    return this.prismaService.testBlock.update({
      where: { id },
      data: testBlock,
    });
  }

  remove(id: number) {
    return this.prismaService.testBlock.delete({ where: { id } });
  }
}
