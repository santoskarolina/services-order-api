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

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private servicoRepository: Repository<Service>,
    private statusService: StatusService,
    private userService: UserService,
  ) {}

  async findAll(user_online: any) {
    const user = await this.userService.findUserByEmail(user_online.email);
    return this.servicoRepository.find({
      where: { user: user },
      relations: ['status'],
    });
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
          status: HttpStatus.BAD_REQUEST,
          error: ErrorsType.NOT_FOUND,
          message: 'Service not found.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return service;
  }

  async delete(id: number) {

    const service = await this.servicoRepository.findOne({
      where: {
        service_id: id
      },
      relations: ['client', 'statuas']
    });

    if (!service) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Service not found.',
          error: ErrorsType.NOT_FOUND
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return this.servicoRepository.delete(id);
    }
  }

  async update(id: number, serviceUpdate: UpdateServicoDto) {
    const status = await this.statusService.findByCode(20);
    const service = await this.servicoRepository.findOne({
      relations: ['client', 'status'],
    });
    if (!service) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Service not found.',
          error: ErrorsType.NOT_FOUND
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const serviceToBeUpdated = await getConnection()
        .createQueryBuilder()
        .update(Service)
        .set({
          description: serviceUpdate.description,
          closing_date: serviceUpdate.closing_date
            ? serviceUpdate.closing_date
            : null,
          status: serviceUpdate.status ? serviceUpdate.status : status,
          price: serviceUpdate.price,
        })
        .where('service_id =:service_id', { service_id: id })
        .execute();
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
