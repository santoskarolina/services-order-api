import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StatusModule } from 'src/status/status.module'
import { ServiceController } from './controller/service.controller'
import { Service } from './entities/service.entity'
import { ServiceService } from './services/service.service'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Service]), StatusModule, UserModule],
  controllers: [ServiceController],
  providers: [ServiceService]
})
export class ServiceModule {}
