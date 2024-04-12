import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  create(createTestDto: CreateTestDto) {
    return this.prismaService.test.create({
      data: createTestDto,
    });
  }

  findAll() {
    return this.prismaService.test.findMany();
  }

  findById(id: number) {
    return this.prismaService.test.findUnique({
      where: { id },
    });
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return this.prismaService.test.update({
      where: { id },
      data: updateTestDto,
    });
  }

  async remove(id: number) {
    const deletedTest = await this.prismaService.test.delete({
      where: { id },
    });
    if (!deletedTest) {
      throw new NotFoundException(`Test with id ${id} not found`);
    }
    return deletedTest;
  }
}
