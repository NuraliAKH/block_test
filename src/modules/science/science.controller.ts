import {
  Body,
  Controller,
  Param,
  UseGuards,
  Get,
  Post,
  Delete,
  Put,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScienceService } from './science.service';
import { CreateScienceDto } from './dto/create-science.dto';
import { UpdateScienceDto } from './dto/update-science.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@/src/lib/enums/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
@Controller('science')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScienceController {
  constructor(private scienceService: ScienceService) {}

  @Get()
  @Roles(Role.Manager)
  async findAll(): Promise<any> {
    const sciencees = await this.scienceService.findAll();

    return { data: sciencees };
  }

  @Get(':id')
  @Roles(Role.Manager)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const data = await this.scienceService.findOne(id);
    return { data };
  }

  @Post()
  @Roles(Role.Manager)
  async create(@Body() createDto: CreateScienceDto): Promise<any> {
    const data = await this.scienceService.create(createDto);
    return { data };
  }

  @Put(':id')
  @Roles(Role.Manager)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateScienceDto,
  ): Promise<any> {
    const data = await this.scienceService.update(id, updateDto);
    return { data };
  }

  @Patch(':id')
  @Roles(Role.Manager)
  async partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateScienceDto,
  ): Promise<any> {
    const data = await this.scienceService.partialUpdate(id, updateDto);
    return { data };
  }

  @Roles(Role.Manager)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const data = await this.scienceService.remove(id);
    return { data };
  }
}
