/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserLogin {
  @IsNotEmpty({ message: 'Name is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
