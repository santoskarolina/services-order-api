import { Service } from "src/service/entities/service.entity";
import { User } from "src/user/entities/user.entity"
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'client', schema:'servicos'})
export class Client {

    @PrimaryGeneratedColumn({type: 'int'})
    client_id: number

    @Column({type: 'varchar', length: 255, nullable: false})
    name:string

    @Column({type: 'varchar', length: 20, nullable: false})
    cell_phone: string

    @Column({type: 'varchar', length: 11, nullable: false})
    cpf: string

    @OneToMany(type => Service, services => services.client)
    services: Service[]

    @ManyToOne(type => User,  user => user.clients)
    @JoinColumn({name:"user_id"})
    user: User
}