import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { TestService } from './test.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@/src/lib/enums/roles.enum';
import { RolesGuard } from '../auth/roles.guard';

@Controller('tests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @Roles(Role.Manager)
  async create(@Body() createTestDto: CreateTestDto) {
    const test = await this.testService.create(createTestDto);
    return { data: test };
  }

  @Get()
  async findAll() {
    const tests = await this.testService.findAll();
    return { data: tests };
  }

  @Get(':id') // Добавляем метод для получения тарифа по его идентификатору
  async findById(@Param('id', ParseIntPipe) id: number) {
    const test = await this.testService.findById(+id);
    return { data: test };
  }

  @Put(':id')
  @Roles(Role.Manager)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTestDto: UpdateTestDto,
  ) {
    const updatedTest = await this.testService.update(+id, updateTestDto);
    return { data: updatedTest };
  }

  @Delete(':id')
  @Roles(Role.Manager)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.testService.remove(+id);
    return { message: 'Test deleted successfully' };
  }
}
