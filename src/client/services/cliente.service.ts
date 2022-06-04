/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorsType } from 'src/error/error.enum';
import { UserService } from 'src/user/service/user.service';
import { Repository, getConnection, Not } from 'typeorm';
import { ClientDto } from '../dto/client.dto';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClienteService {

    constructor(
        @InjectRepository(Client)
        private clienteRepository: Repository<Client>,
        private userService: UserService
    ){}

    async findAll(user_online:any){
        const user = await this.userService.findUserByEmail(user_online.email)
        return this.clienteRepository.find(
            {
                where: { user: user},
                select:['client_id','name','cell_phone']
            })
    }

    async findOne(id:number, user_online:any){
        const user = await this.userService.findByEmail(user_online.email)
        const client = await this.clienteRepository.findOne({
            where: {
                client_id: id,
                user: user
            }
        })
        if(!client){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: ErrorsType.NOT_FOUND,
                message: 'Customer not found.'
            }, HttpStatus.BAD_REQUEST)
        }
        return client
    }

    async delete(id:number){
        const client = await this.clienteRepository.findOne({
            where: {
                client_id: id
            }
        })
        if(!client){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: ErrorsType.NOT_FOUND,
                message: 'Customer not found.'
            }, HttpStatus.BAD_REQUEST)
        }else{
            try{
                return this.clienteRepository.delete(id)
            }catch(error){
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: ErrorsType.CANNOT_BE_DELETED,
                    message: 'Customer cannot be deleted.'
                }, HttpStatus.BAD_REQUEST)
            }
        }
    }

    async update(id:number, clientUpdate: ClientDto){
        const cliente = await this.clienteRepository.findOne({
            where: {
                client_id: id
            }
        }) // customer not found
        if(!cliente){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: ErrorsType.NOT_FOUND,
                message: 'Customer not found.'
            }, HttpStatus.BAD_REQUEST)
        }else{
            if(await this.clienteRepository.findOne({where: {client_id: Not(id), cpf: clientUpdate.cpf}})){
                //CPF belongs to another customer
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: ErrorsType.CPF_ALREADY_REGISTERED,
                    message: `CPF already registered.`
                }, HttpStatus.BAD_REQUEST)
            }else{
                const clientToBeUpdated = await this.clienteRepository.update(cliente.client_id, {
                    cell_phone : clientUpdate.cell_phone,
                    name: clientUpdate.name,
                });
                return clientToBeUpdated
            }
        }
    }

    async findByCpf(cpf:string){
        const clienteFind = await this.clienteRepository.findOne({
            where: {
                cpf: cpf
            }}
        )
        if(clienteFind){
           return true
        }else{
            return false
        }
    }

    async create(client: ClientDto, user_online:any){
        const user = await this.userService.findByEmail(user_online.email)
        //check if cpf is already registered
        const clienteFind = await this.clienteRepository.findOne({
            where: {
                cpf: client.cpf,
                user: user
            }}
        )
        if(clienteFind){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: ErrorsType.CPF_ALREADY_REGISTERED,
                message: 'CPF already registered.'
            }, HttpStatus.BAD_REQUEST)
        }
        client.name = client.name.toUpperCase()
        client.user = user
        return this.clienteRepository.save(client)
    }


    async reports(user_online:any){
        const user = await this.userService.findByEmail(user_online.email)
        const customers = await this.clienteRepository.find(
            {
                where: {user: user},
                relations: ['services']
            })

        const clientsWithServices = customers.filter((c) => c.services.length > 0) //list clients with services
        const clientsWithoutServices =  customers.filter((c) => c.services.length <= 0) // list customers without services

        const withService = clientsWithServices.length
        const withoutService = clientsWithoutServices.length

        return {
            "clientes": customers.length, 
            "clientes_com_servico": withService, 
            "clientes_sem_servicos":  withoutService
        }
    }
}
