import { Test, TestingModule } from '@nestjs/testing';
import { BrandsGateway } from './brands.gateway';

describe('BrandsGateway', () => {
  let gateway: BrandsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandsGateway],
    }).compile();

    gateway = module.get<BrandsGateway>(BrandsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
