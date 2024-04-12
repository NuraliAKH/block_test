import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ScienceService {
  constructor(private prismaService: PrismaService) {}

  create(science: any) {
    return this.prismaService.science.create({ data: science });
  }

  findAll() {
    return this.prismaService.science.findMany({
      select: { tests: true },
    });
  }

  findOne(id: number) {
    return this.prismaService.science.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, science: any) {
    return this.prismaService.science.update({
      where: { id },
      data: science,
    });
  }

  partialUpdate(id: number, science: any) {
    return this.prismaService.science.update({
      where: { id },
      data: science,
    });
  }

  remove(id: number) {
    return this.prismaService.science.delete({ where: { id } });
  }
}
