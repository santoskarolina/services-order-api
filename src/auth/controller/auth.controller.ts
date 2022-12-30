import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common'
import { UserLogin } from 'src/user/dto/user.login'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { AuthService } from '../services/auth.service'

@Controller()
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login (@Body() user: UserLogin) {
    return await this.authService.login(user)
  }

  @Post('auth/validation')
  async checkUser (@Request() request) {
    return await this.authService.checkUser(request.headers.authorization)
  }
}
