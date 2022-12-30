import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ErrorsType } from 'src/error/error.enum'
import { StatusService } from 'src/status/services/status.service'
import { UserService } from 'src/user/service/user.service'
import { Repository } from 'typeorm'
import { ServicoDto } from '../dto/service.dto'
import { UpdateServicoDto } from '../dto/update-service.dto'
import { Service } from '../entities/service.entity'
import { IQuery } from '../../error/quer.model'

@Injectable()
export class ServiceService {
  constructor (
    @InjectRepository(Service)
    private readonly servicoRepository: Repository<Service>,
    private readonly statusService: StatusService,
    private readonly userService: UserService
  ) { }

  async findAll (user_online: any, query?: IQuery) {
    const user = await this.userService.findUserByEmail(user_online.email)
    let resp = {}

    if (Object.keys(query).length) {
      resp = this.findWithQueryOptions(query, user)
    } else {
      resp = this.findWithoutQuery(user)
    }

    return resp
  }

  async findWithQueryOptions (query, user) {
    let whereFilter = {}

    const take = query.take || 12
    const page = query.page || 1
    const skip = (page - 1) * take

    if (query.filter) {
      whereFilter = { user, status: { name: query.filter } }
    } else {
      whereFilter = { user }
    }

    const [services, total] = await this.createFindOptions(whereFilter, take, skip)

    const response = this.createResponse(services, page, total)
    return response
  }

  async findWithoutQuery (user) {
    const services = await this.servicoRepository.find({
      where: { user },
      relations: {
        status: true,
        client: true
      }
    })

    const resp = {
      services,
      totalSize: services.length
    }

    return resp
  }

  async createFindOptions (whereFilter, take, skip) {
    const query = await this.servicoRepository.findAndCount({
      where: whereFilter,
      relations: { status: true },
      take,
      skip
    })
    return query
  }

  createResponse (services, page, total) {
    const resp = {
      services,
      page,
      totalSize: services.length,
      count: total
    }
    return resp
  }

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

  async findOne (id: number, user_online: any) {
    const user = await this.userService.findUserByEmail(user_online.email)

    const service = await this.servicoRepository.findOne({
      where: {
        service_id: id,
        user
      },
      relations: ['client', 'status']
    })

    if (!service) {
      this.throwHttpException('Service not found.', ErrorsType.NOT_FOUND, HttpStatus.PRECONDITION_FAILED)
    }
    return service
  }

  async delete (id: number) {
    const service = await this.servicoRepository.findOne({
      where: {
        service_id: id
      },
      relations: ['client', 'status']
    })

    if (!service) {
      this.throwHttpException('Service not found.', ErrorsType.NOT_FOUND, HttpStatus.PRECONDITION_FAILED)
    } else {
      return await this.servicoRepository.delete(id)
    }
  }

  async update (id: number, serviceUpdate: UpdateServicoDto) {
    const status = await this.statusService.findByCode(20)
    const service = await this.servicoRepository.findOne({
      where: {
        service_id: id
      },
      relations: ['client', 'status']
    })
    if (!service) {
      this.throwHttpException('Service not found.', ErrorsType.NOT_FOUND, HttpStatus.PRECONDITION_FAILED)
    } else {
      return await this.confirmUpdateService(serviceUpdate, service)
    }
  }

  async confirmUpdateService (serviceUpdate: UpdateServicoDto, service: Service) {
    const serviceToBeUpdated = await this.servicoRepository.update(service.service_id, {
      description: serviceUpdate.description,
      closing_date: serviceUpdate.closing_date,
      status: serviceUpdate.status,
      price: serviceUpdate.price
    })
    return serviceToBeUpdated
  }

  async create (service: ServicoDto, user_online: any) {
    const user = await this.userService.findUserByEmail(user_online.email)
    const status = await this.statusService.findByCode(10)
    service.user = user
    service.opening_date = new Date()
    service.status = status
    return await this.servicoRepository.save(service)
  }

  async reportService (user_online: any) {
    const user = await this.userService.findUserByEmail(user_online.email)

    const services = await this.servicoRepository.find({
      where: { user },
      relations: ['status']
    })

    const servicesOpen = services.filter((s) => s.status.code == 10)
    const servicesClose = services.filter((s) => s.status.code == 20)

    const totalOpen = servicesOpen.length
    const totalClose = servicesClose.length

    return {
      servicos: services.length,
      servicos_abertos: totalOpen,
      servicos_fechados: totalClose
    }
  }
}
