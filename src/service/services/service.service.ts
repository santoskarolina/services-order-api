/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorsType } from 'src/error/error.enum';
import { StatusService } from 'src/status/services/status.service';
import { UserService } from 'src/user/service/user.service';
import { Repository, getConnection } from 'typeorm';
import { ServicoDto } from '../dto/service.dto';
import { UpdateServicoDto } from '../dto/update-service.dto';
import { Service } from '../entities/service.entity';
import { IQuery } from "../../error/quer.model";

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private servicoRepository: Repository<Service>,
    private statusService: StatusService,
    private userService: UserService,
  ) {}

  async findAll(user_online: any, query: IQuery) {
    const take= query.take || 12
    const page=query.page || 1;
    const skip= (page-1) * take ;

    const user = await this.userService.findUserByEmail(user_online.email);
    const [services, total] = await this.servicoRepository.findAndCount({
      where: { user: user },
      relations: ['status'],
      take: take,
      skip: skip
    });

    return {
      services: services,
      page: page,
      totalSize: services.length,
      count: total,
    }
  }

  async findOne(id: number, user_online: any) {
    const user = await this.userService.findUserByEmail(user_online.email);

    const service = await this.servicoRepository.findOne({
      where: {
        service_id: id,
        user: user
      },
      relations: ['client', 'status']
    })

    if (!service) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          error: ErrorsType.NOT_FOUND,
          message: 'Service not found.',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    return service;
  }

  async delete(id: number) {

    const service = await this.servicoRepository.findOne({
      where: {
        service_id: id
      },
      relations: ['client', 'status']
    });

    if (!service) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'Service not found.',
          error: ErrorsType.NOT_FOUND
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    } else {
      return this.servicoRepository.delete(id);
    }
  }

  async update(id: number, serviceUpdate: UpdateServicoDto) {
    const status = await this.statusService.findByCode(20);
    const service = await this.servicoRepository.findOne({
      where: {
          service_id: id,
      },
      relations: ['client', 'status'],
    });
    if (!service) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'Service not found.',
          error: ErrorsType.NOT_FOUND
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    } else {
      const serviceToBeUpdated = await this.servicoRepository.update(service.service_id, {
        description: serviceUpdate.description,
        closing_date: serviceUpdate.closing_date,
        status: serviceUpdate.status,
        price: serviceUpdate.price
      });
      return serviceToBeUpdated;
    }
  }

  async create(service: ServicoDto, user_online: any) {
    const user = await this.userService.findUserByEmail(user_online.email);
    const status = await this.statusService.findByCode(10);
    service.user = user;
    service.opening_date = new Date();
    service.status = status;
    return this.servicoRepository.save(service);
  }

  async reportService(user_online: any) {
    const user = await this.userService.findUserByEmail(user_online.email);

    const services = await this.servicoRepository.find({
      where: { user: user },
      relations: ['status'],
    });

    const servicesOpen = services.filter((s) => s.status.code == 10);
    const servicesClose = services.filter((s) => s.status.code == 20);

    const totalOpen = servicesOpen.length;
    const totalClose = servicesClose.length;

    return {
      servicos: services.length,
      servicos_abertos: totalOpen,
      servicos_fechados: totalClose,
    };
  }
}
