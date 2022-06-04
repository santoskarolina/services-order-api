import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../entities/status.entity';

@Injectable()
export class StatusService {

  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>
  ){}

  findAll() {
    return this.statusRepository.find()
  }

  async findByCode(code: number){
    const status = await this.statusRepository.findOne({
      where: {
        code: code
      },
      relations: ['services']
    })
    if(!status){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Status not found.'
      }, HttpStatus.BAD_REQUEST)
    }
    return status
  }
}
