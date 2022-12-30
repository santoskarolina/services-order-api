import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Put
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { UserCreateDto } from '../dto/user-create.dto'
import { UserUpdatePhotoDto } from '../dto/user_update_photo.dto'
import { UserService } from '../service/user.service'

@Controller('user')
export class UserController {
  constructor (private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll () {
    return await this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get('infos')
  async findOne (@Request() request) {
    return await this.userService.findOne(request.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/relations')
  async findOneWithRelations (@Param('id') id: number) {
    return await this.userService.findOneWithRelations(id)
  }

  @Post()
  async create (@Body() newUser: UserCreateDto) {
    return await this.userService.create(newUser)
  }

  @Put('update-photo/:id')
  async updatePhoto (@Body() photo: UserUpdatePhotoDto, @Param('id') id: number) {
    return await this.userService.updatePhoto(photo, id)
  }
}
