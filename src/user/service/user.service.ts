/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { UserCreateDto } from '../dto/user-create.dto';
import { User } from '../entities/user.entity';
import * as crypto from 'crypto';
import { UserUpdatePhotoDto } from '../dto/user_update_photo.dto';
import { ErrorsType } from 'src/error/error.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find({
      select: ['user_id', 'user_name', 'email', 'photo'],
    });
  }

  async findOne(user_online: any) {
    const userOnline = await this.findUserByEmail(user_online.email);

    const user = await this.userRepository.findOne({
      where: {
        user_id: userOnline.user_id
      },
      select: ['user_id', 'creation_date', 'email', 'photo', 'user_name']
    })

    if (!user) {
      throw new HttpException(
        {
          message: 'User not found.',
          status: HttpStatus.BAD_REQUEST,
          error: ErrorsType.NOT_FOUND,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async findOneWithRelations(id: number) {
    const user = await this.userRepository.findOne({
      where: {
          user_id: id
      },
      relations: ['clients', 'services'],
    });
    if (!user) {
      throw new HttpException(
        {
          message: 'User not found.',
          status: HttpStatus.BAD_REQUEST,
          error: ErrorsType.NOT_FOUND
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async create(new_user: UserCreateDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: new_user.email,
      },
    });
    if (user) {
      throw new HttpException(
        {
          message: 'Email already registred.',
          error: ErrorsType.EMAIL_ALREADY_REGISTERED,
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      new_user.password = crypto
        .createHmac('sha256', new_user.password)
        .digest('hex');
      new_user.creation_date = new Date();
      const user = await this.userRepository.save(new_user);

     return  user
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    return user;
  }

  async updatePhoto(photo: UserUpdatePhotoDto, user_id: number){
      const user = await this.userRepository.findOne({
        where: {
          user_id: user_id
        }
      })

      return await this.userRepository.update(user.user_id, {
        photo: photo.photo
      })
  }
 
}
