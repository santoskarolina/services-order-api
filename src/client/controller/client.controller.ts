import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ClientDto } from '../dto/client.dto'
import { ClienteService } from '../services/cliente.service'
import { IQuery } from '../../error/quer.model'

@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClienteController {
  constructor (private readonly clienteService: ClienteService) {}

  @Post()
  async create (@Body() createClienteDto: ClientDto, @Request() request) {
    return await this.clienteService.create(createClienteDto, request.user)
  }

  @Get()
  async findAll (@Request() request, @Query() query?: IQuery) {
    return await this.clienteService.findAll(request.user, query)
  }

  @Get(':id')
  async findOne (@Param('id') id: number, @Request() request) {
    return await this.clienteService.findOne(id, request.user)
  }

  @Get('buscar/:cpf')
  async findOneByCpf (@Param('cpf') cpf: string) {
    return await this.clienteService.findByCpf(cpf)
  }

  @Put(':id')
  async update (@Param('id') id: number, @Body() updateClienteDto: ClientDto) {
    return await this.clienteService.update(id, updateClienteDto)
  }

  @Delete(':id')
  async remove (@Param('id') id: number) {
    return await this.clienteService.delete(id)
  }

  @Get('servicos/relatorios')
  async reports (@Request() request) {
    return await this.clienteService.reports(request.user)
  }
}
