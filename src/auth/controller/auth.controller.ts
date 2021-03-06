import { Controller, Post, UseGuards, Request, Body } from "@nestjs/common";
import { UserLogin } from "src/user/dto/user.login";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { AuthService } from "../services/auth.service";

@Controller()
export class AuthController{

    constructor(private authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Body() user: UserLogin){
        return this.authService.login(user)
    }

}