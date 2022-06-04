import { IsNotEmpty, Length } from "class-validator"

export class StatusDto {

    @IsNotEmpty({message: 'Name is required'})
    @Length(3, 255, {message: 'Name must be between 5 and 255 characters'})
    name:string

    @IsNotEmpty({message: 'Name is required'})
    @Length(2, 255, {message: 'Code must be between 2 and 255 characters'})
    code: number
}
