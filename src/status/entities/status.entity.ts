import { Service } from "src/service/entities/service.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "status", schema:'servicos'})
export class Status {

    @PrimaryGeneratedColumn({type: 'int'})
    status_id: number

    @Column({type: 'varchar', length: 255, nullable: false})
    name:string

    @Column({type: 'int', nullable: false})
    code:number

    @OneToMany(type => Service, services => services.status)
    services: Service[]
}
