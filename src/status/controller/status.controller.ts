import { Controller, Get } from '@nestjs/common';
import { StatusService } from '../services/status.service';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  findAll() {
    return this.statusService.findAll();
  }

}
