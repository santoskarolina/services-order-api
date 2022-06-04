import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusController } from './controller/status.controller';
import { Status } from './entities/status.entity';
import { StatusService } from './services/status.service';

@Module({
  imports:[TypeOrmModule.forFeature([Status])],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService]
})
export class StatusModule {}
