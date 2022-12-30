import { Service } from 'src/service/entities/service.entity'
import { Client } from 'src/client/entities/client.entity'
import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  OneToMany
} from 'typeorm'

@Entity({ name: 'user', schema: 'servicos' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
    user_id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
    user_name: string

  @Column({ type: 'varchar', length: 255, nullable: false })
    email: string

  @Column({ type: 'varchar', length: 255, nullable: false })
    password: string

  @Column({ type: 'varchar', length: 255, nullable: false })
    photo: string

  @Column({ type: 'varchar', length: 255, nullable: false })
    occupation_area: string

  @Column({ type: 'date', nullable: false })
    creation_date: Date

  @OneToMany(() => Service, (service) => service.user)
    services: Service[]

  @OneToMany(() => Client, (client) => client.user)
    clients: Client[]
}
