import { IsNotEmpty, Length } from 'class-validator'
import { Client } from 'src/client/entities/client.entity'
import { Status } from 'src/status/entities/status.entity'
import { User } from 'src/user/entities/user.entity'

export class ServicoDto {
  @IsNotEmpty({ message: 'Description is required' })
  @Length(10, 255, { message: 'Description must be between 10 and 255 characters' })
    description: string

  opening_date: Date

  closing_date: Date

  @IsNotEmpty({ message: 'Price is required' })
    price: number

  @IsNotEmpty({ message: 'Client is required' })
    client: Client

  status: Status

  user: User
}
