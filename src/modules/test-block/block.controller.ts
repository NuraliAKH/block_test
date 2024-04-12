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
import { TestBlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@/src/lib/enums/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
@Controller('test-block')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BlockController {
  constructor(private blockService: TestBlockService) {}

  // GET method example
  @Get()
  @Roles(Role.Manager)
  async findAll(): Promise<any> {
    const blockes = await this.blockService.findAll();

    return { data: blockes };
  }

  // GET with params example
  @Get(':id')
  @Roles(Role.Manager)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const data = await this.blockService.findOne(id);
    return { data };
  }

  // POST method example
  @Post()
  @Roles(Role.Manager)
  async create(@Body() createDto: CreateBlockDto): Promise<any> {
    const data = await this.blockService.create(createDto);
    return { data };
  }

  // PUT method example
  @Put(':id')
  @Roles(Role.Manager)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBlockDto,
  ): Promise<any> {
    const data = await this.blockService.update(id, updateDto);
    return { data };
  }

  // PATCH method example
  @Patch(':id')
  @Roles(Role.Manager)
  async partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBlockDto,
  ): Promise<any> {
    const data = await this.blockService.partialUpdate(id, updateDto);
    return { data };
  }

  // DELETE method example
  @Roles(Role.Manager)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const data = await this.blockService.remove(id);
    return { data };
  }
}
