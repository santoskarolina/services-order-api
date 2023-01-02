/* eslint-disable no-multi-spaces */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserCreateDto } from '../dto/user-create.dto'
import { User } from '../entities/user.entity'
import * as crypto from 'crypto'
import { UserUpdatePhotoDto } from '../dto/user_update_photo.dto'
import { ErrorsType } from 'src/error/error.enum'

@Injectable()
export class UserService {
  constructor (
    @InjectRepository(User)
    // eslint-disable-next-line @typescript-eslint/prefer-readonly
    private userRepository: Repository<User>
  ) {}

  async findAll () {
    return await this.userRepository.find({
      select: ['user_id', 'user_name', 'email', 'photo']
    })
  }

  async findOne (userRequest: any) {
    const userOnline = await this.findUserByEmail(userRequest.email)

    const user = await this.userRepository.findOne({
      where: {
        user_id: userOnline?.user_id
      },
      select: ['user_id', 'creation_date', 'email', 'photo', 'user_name', 'occupation_area']
    })

    if (!user) {
      this.throwHttpException('User not found.', ErrorsType.NOT_FOUND, HttpStatus.BAD_REQUEST)
    }
    return user
  }

  async findOneWithRelations (id: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: id
      },
      relations: ['clients', 'services']
    })
    if (!user) {
      this.throwHttpException('User not found.', ErrorsType.NOT_FOUND, HttpStatus.BAD_REQUEST)
    }
    return user
  }

  async findByEmail (userEmail: string) {
    return await this.userRepository.findOne({
      where: {
        email: userEmail
      }
    })
  }

  async findByEmailSn (email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email
      }
    })

    if (user) {
      return user
    }
  }

  async create (newUser: UserCreateDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: newUser.email
      }
    })
    if (user) {
      this.throwHttpException('Email already registred.', ErrorsType.EMAIL_ALREADY_REGISTERED, HttpStatus.BAD_REQUEST)
    } else {
      newUser.password = crypto
        .createHmac('sha256', newUser.password)
        .digest('hex')
      newUser.creation_date = new Date()
      if (!newUser.photo || newUser.photo === '') {
        const photo = process.env.USER_PHOTO
        newUser.photo = photo ?? ''
      }
      const user = await this.userRepository.save(newUser)

      return user
    }
  }

  async findUserByEmail (email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email
      },
      select: ['creation_date', 'email', 'photo', 'user_name', 'user_id']
    })
    return user
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

  async updatePhoto (photo: UserUpdatePhotoDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        user_id: userId
      },
      select: ['photo', 'user_id', 'user_name']
    })
    if (!user) {
      this.throwHttpException('User not found', ErrorsType.NOT_FOUND, HttpStatus.BAD_REQUEST)
    } else {
      return await this.confirmUpdateUserPhoto(user, photo)
    }
  }

  async confirmUpdateUserPhoto (user: User, photo: UserUpdatePhotoDto) {
    try {
      await this.userRepository.update(user.user_id, {
        photo: photo.photo
      })
      return { user: user.user_id, photo: photo.photo, status: HttpStatus.OK, message: 'Foto atualizada com sucesso' }
    } catch (error) {
      this.throwHttpException('User could not be updated', ErrorsType.USER_DOES_NOT_UPDATE, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }
}
