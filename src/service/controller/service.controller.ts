/* eslint-disable prettier/prettier */
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
} from "@nestjs/common";
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ServicoDto } from '../dto/service.dto';
import { UpdateServicoDto } from '../dto/update-service.dto';
import { ServiceService } from '../services/service.service';
import { IQuery } from "../../error/quer.model";

@UseGuards(JwtAuthGuard)
@Controller('servicos')
export class ServiceController {
  constructor(private readonly servicoService: ServiceService) {}

  @Post()
  create(@Body() createStatusDto: ServicoDto, @Request() request) {
    return this.servicoService.create(createStatusDto, request.user);
  }

  @Get()
  findAll(@Request() request, @Query() query: IQuery) {
    return this.servicoService.findAll(request.user, query);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() request) {
    return this.servicoService.findOne(id, request.user);
  }

  @Get('todos/report')
  reportServices(@Request() request) {
    return this.servicoService.reportService(request.user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateStatusDto: UpdateServicoDto) {
    return this.servicoService.update(id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.servicoService.delete(id);
  }
}
