import { IsNotEmpty, IsEmail, Length } from 'class-validator'

export class UserCreateDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 255, { message: 'Name must be between 3 and 255 characters' })
    user_name: string

  @IsNotEmpty({ message: 'Name is required' })
  @IsEmail()
    email: string

  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 255, { message: 'Password must be between 8 and 255 characters' })
    password: string

  @IsNotEmpty({ message: 'occupation_area is required' })
    occupation_area: string

  creation_date: Date

  photo: string
}
