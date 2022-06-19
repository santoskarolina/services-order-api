import { IsNotEmpty, Length } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class ClientDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Length(5, 255, { message: 'Name must be between 5 and 255 characters' })
  name: string;

  @IsNotEmpty({ message: 'Cell phone is required' })
  @Length(9, 20, { message: 'Cell phone must be between 9 and 20 characters' })
  cell_phone: string;

  @IsNotEmpty({ message: 'CPF phone is required' })
  @Length(11, 11, { message: 'CPF must be have 11 characters' })
  cpf: string;

  user: User;
}
