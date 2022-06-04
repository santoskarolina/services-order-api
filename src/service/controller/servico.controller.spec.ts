import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from '../services/service.service';
import { ServiceController } from './service.controller';

describe('ServicoController', () => {
  let controller: ServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [ServiceService],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
