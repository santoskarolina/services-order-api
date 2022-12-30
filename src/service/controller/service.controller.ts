import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request, Query
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ServicoDto } from '../dto/service.dto'
import { UpdateServicoDto } from '../dto/update-service.dto'
import { ServiceService } from '../services/service.service'
import { IQuery } from '../../error/quer.model'

@UseGuards(JwtAuthGuard)
@Controller('servicos')
export class ServiceController {
  constructor (private readonly servicoService: ServiceService) {}

  @Post()
  async create (@Body() createStatusDto: ServicoDto, @Request() request) {
    return await this.servicoService.create(createStatusDto, request.user)
  }

  @Get()
  async findAll (@Request() request, @Query() query?: IQuery) {
    return await this.servicoService.findAll(request.user, query as IQuery)
  }

  @Get(':id')
  async findOne (@Param('id') id: number, @Request() request) {
    return await this.servicoService.findOne(id, request.user)
  }

  @Get('todos/report')
  async reportServices (@Request() request) {
    return await this.servicoService.reportService(request.user)
  }

  @Put(':id')
  async update (@Param('id') id: number, @Body() updateStatusDto: UpdateServicoDto) {
    return await this.servicoService.update(id, updateStatusDto)
  }

  @Delete(':id')
  async remove (@Param('id') id: number) {
    return await this.servicoService.delete(id)
  }
}
