import { User } from './../../user/entities/user.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ErrorsType } from 'src/error/error.enum'
import { UserService } from 'src/user/service/user.service'
import { Not, Repository } from 'typeorm'
import { ClientDto } from '../dto/client.dto'
import { Client } from '../entities/client.entity'
import { IQuery } from '../../error/quer.model'

@Injectable()
export class ClienteService {
  constructor (
    @InjectRepository(Client)
    private readonly clienteRepository: Repository<Client>,
    private readonly userService: UserService
  ) { }

  throwHttpException (message: string, error: ErrorsType, status: HttpStatus) {
    throw new HttpException(
      {
        message,
        error,
        status
      },
      status
    )
  }

  async findAll (user_online: any, query?: IQuery) {
    const user = await this.userService.findUserByEmail(user_online.email)
    let usersList = {}

    if (Object.values(query).length) {
      usersList = await this.finfAllUsersWithQuery(user, query)
    } else {
      usersList = this.findAllUsersWithoutQuery(user)
    }

    return usersList
  }

  createResponse (users: Client[], page: number, total: number) {
    const response = {
      users,
      page,
      totalSize: users.length,
      count: total
    }
    return response
  }

  createQuery (query: IQuery) {
    const take = query.take || 12
    const page = query.page || 1
    const skip = (page - 1) * take
    return { take, page, skip }
  }

  async finfAllUsersWithQuery (user: User, query: IQuery) {
    const { take, page, skip } = this.createQuery(query)
    const [users, total] = await this.usersListWithQuery(user, { take, skip })
    const response = this.createResponse(users, page, total)
    return response
  }

  async findAllUsersWithoutQuery (user) {
    const users = await this.clienteRepository.find({
      where: { user },
      select: ['client_id', 'name', 'cell_phone']
    })

    const response = {
      users,
      totalSize: users.length
    }
    return response
  }

  async usersListWithQuery (user, { take, skip }) {
    const usersList = await this.clienteRepository.findAndCount(
      {
        where: { user },
        select: ['client_id', 'name', 'cell_phone'],
        take,
        skip
      })

    return usersList
  }

  async findOne (id: number, user_online: any) {
    const user = await this.userService.findByEmail(user_online.email)
    const client = await this.clienteRepository.findOne({
      where: {
        client_id: id,
        user
      }
    })
    if (!client) {
      this.throwHttpException('Customer not found.', ErrorsType.NOT_FOUND, HttpStatus.PRECONDITION_FAILED)
    }
    return client
  }

  async delete (id: number) {
    const client = await this.clienteRepository.findOne({ where: { client_id: id } })
    if (!client) {
      this.throwHttpException('Customer not found.', ErrorsType.NOT_FOUND, HttpStatus.PRECONDITION_FAILED)
    } else {
      return await this.confirmDeleteClient(id)
    }
  }

  async confirmDeleteClient (id: number) {
    try {
      return await this.clienteRepository.delete(id)
    } catch (error) {
      this.throwHttpException('Customer cannot be deleted.', ErrorsType.CANNOT_BE_DELETED, HttpStatus.PRECONDITION_FAILED)
    }
  }

  async update (id: number, clientUpdate: ClientDto) {
    const cliente = await this.clienteRepository.findOne({
      where: {
        client_id: id
      }
    }) // customer not found
    if (!cliente) {
      this.throwHttpException('Customer not found.', ErrorsType.NOT_FOUND, HttpStatus.PRECONDITION_FAILED)
    } else {
      return await this.confirmUpdateCLient(clientUpdate, id)
    }
  }

  async confirmUpdateCLient (clientUpdate, client_id) {
    const useriWithcpf = await this.clienteRepository.findOne({ where: { client_id: Not(client_id), cpf: clientUpdate.cpf } })

    if (useriWithcpf) {
      this.throwHttpException('CPF already registered.', ErrorsType.CPF_ALREADY_REGISTERED, HttpStatus.PRECONDITION_FAILED)
    } else {
      return await this.clienteRepository.update(client_id, {
        cell_phone: clientUpdate.cell_phone,
        name: clientUpdate.name
      })
    }
  }

  async findByCpf (cpf: string) {
    const clienteFind = await this.clienteRepository.findOne({
      where: {
        cpf
      }
    }
    )
    return !!clienteFind
  }

  async create (client: ClientDto, userOnline: any) {
    const user = await this.userService.findByEmail(userOnline.email)
    const clienteFind = await this.clienteRepository.findOne({
      where: {
        cpf: client.cpf,
        user
      }
    }
    )
    if (clienteFind) {
      this.throwHttpException('CPF already registered.', ErrorsType.CPF_ALREADY_REGISTERED, HttpStatus.PRECONDITION_FAILED)
    }
    client.name = client.name.toUpperCase()
    client.user = user
    return await this.clienteRepository.save(client)
  }

  async reports (user_online: any) {
    const user = await this.userService.findByEmail(user_online.email)
    const customers = await this.clienteRepository.find({
      where: { user },
      relations: ['services']
    })

    const clientsWithServices = customers.filter((c) => c.services.length > 0) // list clients with services
    const clientsWithoutServices = customers.filter((c) => c.services.length <= 0) // list customers without services

    const withService = clientsWithServices.length
    const withoutService = clientsWithoutServices.length

    return {
      clientes: customers.length,
      clientes_com_servico: withService,
      clientes_sem_servicos: withoutService
    }
  }
}
