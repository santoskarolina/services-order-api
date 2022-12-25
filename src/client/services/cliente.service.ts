/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorsType } from "src/error/error.enum";
import { UserService } from "src/user/service/user.service";
import { Not, Repository } from "typeorm";
import { ClientDto } from "../dto/client.dto";
import { Client } from "../entities/client.entity";
import { IQuery } from "../../error/quer.model";

@Injectable()
export class ClienteService {

    constructor(
        @InjectRepository(Client)
        private clienteRepository: Repository<Client>,
        private userService: UserService
    ){}

    async findAll(user_online:any, query?: IQuery){
        const user = await this.userService.findUserByEmail(user_online.email)
        let resp = {}

        if(Object.values(query).length){
            const take = query.take || 12
            const page = query.page || 1;
            const skip = (page-1) * take ;

            const [users, total] = await  this.clienteRepository.findAndCount(
              {
                  where: { user: user},
                  select:['client_id','name','cell_phone'],
                  take: take,
                  skip: skip,
              })

            resp =  {
                users: users,
                page: page,
                totalSize: users.length,
                count: total,
            }
        }else{
            const users = await this.clienteRepository.find({
                where: { user: user},
                select:['client_id','name','cell_phone'],
            })

            resp = {
                users: users,
                totalSize: users.length,
            }
        }

        return resp
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
                status: HttpStatus.PRECONDITION_FAILED,
                error: ErrorsType.NOT_FOUND,
                message: 'Customer not found.'
            }, HttpStatus.PRECONDITION_FAILED)
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
                status: HttpStatus.PRECONDITION_FAILED,
                error: ErrorsType.NOT_FOUND,
                message: 'Customer not found.'
            }, HttpStatus.PRECONDITION_FAILED)
        }else{
            try{
                return this.clienteRepository.delete(id)
            }catch(error){
                throw new HttpException({
                    status: HttpStatus.PRECONDITION_FAILED,
                    error: ErrorsType.CANNOT_BE_DELETED,
                    message: 'Customer cannot be deleted.'
                }, HttpStatus.PRECONDITION_FAILED)
            }
        }
    }

    async update(id:number, clientUpdate: ClientDto){
        console.log("🚀 ~ file: cliente.service.ts:102 ~ ClienteService ~ update ~ id", id)
        console.log("🚀 ~ file: cliente.service.ts:102 ~ ClienteService ~ update ~ clientUpdate", clientUpdate)
        const cliente = await this.clienteRepository.findOne({
            where: {
                client_id: id
            }
        }) // customer not found
        if(!cliente){
            throw new HttpException({
                status: HttpStatus.PRECONDITION_FAILED,
                error: ErrorsType.NOT_FOUND,
                message: 'Customer not found.'
            }, HttpStatus.PRECONDITION_FAILED)
        }else{
            const useriWithcpf = await this.clienteRepository.findOne({where: {client_id: Not(id), cpf: clientUpdate.cpf}})
            if(useriWithcpf){
                //CPF belongs to another customer
                throw new HttpException({
                    status: HttpStatus.PRECONDITION_FAILED,
                    error: ErrorsType.CPF_ALREADY_REGISTERED,
                    message: `CPF already registered.`
                }, HttpStatus.PRECONDITION_FAILED)
            }else{
                return await this.clienteRepository.update(cliente.client_id, {
                    cell_phone: clientUpdate.cell_phone,
                    name: clientUpdate.name,
                })
            }
        }
    }

    async findByCpf(cpf:string){
        const clienteFind = await this.clienteRepository.findOne({
            where: {
                cpf: cpf
            }}
        )
        return !!clienteFind;
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
                status: HttpStatus.PRECONDITION_FAILED,
                error: ErrorsType.CPF_ALREADY_REGISTERED,
                message: 'CPF already registered.'
            }, HttpStatus.PRECONDITION_FAILED)
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
