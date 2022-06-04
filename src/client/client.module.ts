import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ClienteController } from './controller/client.controller';
import { Client } from './entities/client.entity';
import { ClienteService } from './services/cliente.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), UserModule],
  controllers: [ClienteController],
  providers: [ClienteService]
})
export class ClientModule {}
