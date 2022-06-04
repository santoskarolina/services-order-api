import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ClientDto } from '../dto/client.dto';
import { ClienteService } from '../services/cliente.service';

@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  create(@Body() createClienteDto: ClientDto, @Request() request) {
    return this.clienteService.create(createClienteDto, request.user);
  }

  @Get()
  findAll(@Request() request) {
    return this.clienteService.findAll(request.user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() request) {
    return this.clienteService.findOne(id, request.user);
  }

  @Get('buscar/:cpf')
  findOneByCpf(@Param('cpf') cpf: string) {
    return this.clienteService.findByCpf(cpf);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateClienteDto: ClientDto) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.clienteService.delete(id);
  }

  @Get('servicos/relatorios')
  reports(@Request() request){
    return this.clienteService.reports(request.user)
  }
}
