import { IsNotEmpty, Length } from 'class-validator'
import { Status } from 'src/status/entities/status.entity'

export class UpdateServicoDto {
  @IsNotEmpty({ message: 'Description is required' })
  @Length(10, 255, { message: 'Description must be between 10 and 255 characters' })
    description: string

  opening_date: Date

  closing_date: Date

  @IsNotEmpty({ message: 'Price is required' })
    price: number

  status: Status
}
