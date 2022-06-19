/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Put
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserCreateDto } from '../dto/user-create.dto';
import { UserUpdatePhotoDto } from '../dto/user_update_photo.dto';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('infos')
  findOne(@Request() request) {
    return this.userService.findOne(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/relations')
  findOneWithRelations(@Param('id') id: number) {
    return this.userService.findOneWithRelations(id);
  }

  @Post()
  create(@Body() new_user: UserCreateDto) {
    return this.userService.create(new_user);
  }

  @Put('update-photo/:id')
  updatePhoto(@Body() photo:UserUpdatePhotoDto, @Param('id') id: number) {
    return this.userService.updatePhoto(photo, id);
  }
}
