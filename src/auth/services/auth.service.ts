import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { JwtService } from '@nestjs/jwt'
import { ErrorsType } from 'src/error/error.enum'
import { UserService } from 'src/user/service/user.service'

@Injectable()
export class AuthService {
  user: any = {}

  constructor (
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser (userEmail: string, userPassword: string): Promise<any> {
    this.user = await this.userService.findByEmail(userEmail)

    userPassword = crypto.createHmac('sha256', userPassword).digest('hex')

    if (this.user && this.user.password === userPassword) {
      return this.user
    }
    return null
  }

  async checkUserToken (token: string) {
    const tokenKey = token.split(' ')[1]
    const user = JSON.parse(Buffer.from(tokenKey.split('.')[1], 'base64').toString())

    const authenticatedUser = await this.userService.findUserByEmail(user.email)
    if (authenticatedUser) {
      return authenticatedUser
    } else {
      throw new HttpException(
        {
          message: 'Unauthenticated user',
          error: ErrorsType.UNAUTHENTICATED_USER,
          status: HttpStatus.UNAUTHORIZED
        },
        HttpStatus.UNAUTHORIZED
      )
    }
  }

  async login (user: any) {
    const userfind = await this.userService.findUserByEmail(user.email)
    const payload = { email: user.email, sub: user.id }
    const userAuth = {
      ...userfind,
      access_token: this.jwtService.sign(payload)
    }
    return userAuth
  }
}
