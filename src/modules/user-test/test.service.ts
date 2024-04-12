import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class UserTestService {
  constructor(private prismaService: PrismaService) {}

  create(createTestDto: CreateTestDto) {
    return this.prismaService.userTest.create({
      data: createTestDto,
    });
  }

  findAll() {
    return this.prismaService.userTest.findMany();
  }

  findById(id: number) {
    return this.prismaService.userTest.findUnique({
      where: { id },
    });
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return this.prismaService.userTest.update({
      where: { id },
      data: updateTestDto,
    });
  }

  async remove(id: number) {
    const deletedUserTest = await this.prismaService.userTest.delete({
      where: { id },
    });
    if (!deletedUserTest) {
      throw new NotFoundException(`userTest with id ${id} not found`);
    }
    return deletedUserTest;
  }
}
