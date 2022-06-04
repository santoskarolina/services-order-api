import { Client } from "src/client/entities/client.entity";
import { Status } from "src/status/entities/status.entity";
import { User } from "src/user/entities/user.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'service', schema:'servicos'})
export class Service {

    @PrimaryGeneratedColumn({type: 'int'})
    service_id: number

    @Column({type: 'varchar', length: 255, nullable: false})
    description: string
    
    @Column({ type: 'numeric', nullable: false })
    price: number
    
    @Column({ type: 'date' })
    opening_date: Date

    @Column({ type: 'date' , nullable: true})
    closing_date: Date

    @ManyToOne(type => Status, status=> status.services)
    @JoinColumn({name: "status_id"})
    status: Status

    @ManyToOne(type => Client, client => client.services)
    @JoinColumn({name: "client_id"})
    client: Client

    @ManyToOne(type => User,  user => user.services)
    @JoinColumn({name:"user_id"})
    user: User
}