import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { providers } from 'src/source-code/mock/providers/providers';
import { MockUserModel } from 'src/source-code/mock/entities/user.mock';
import { ReqLocalRegister } from './dto/req-local-register.dto';
import { ResLocalRegister } from './dto/res-local-register.dto';
import { RegisterService } from './register.service';

describe('RegisterController', () => {
  let controller: RegisterController;
  let registerService: RegisterService;
  const { user, accessToken } = MockUserModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers,
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
    registerService = module.get<RegisterService>(RegisterService);
  });

  // LRTEST: - usex, returnx
  describe('Local Register', () => {
    const reqLocalRegister: ReqLocalRegister = {
      ...user,
      password: 'p@ssw0rd',
    };
    it('Use | localRegister', async () => {
      jest.spyOn(registerService, 'localRegister');
      await controller.localRegister(reqLocalRegister);
      expect(registerService.localRegister).toHaveBeenCalled();
    });

    it('Return | ResLocalRegister', async () => {
      const result = await controller.localRegister(reqLocalRegister);
      expect(result).toBeInstanceOf(ResLocalRegister);

      const resLocalRegister: ResLocalRegister = { accessToken, user };
      const keys = Object.keys(result);
      const required = Object.keys(resLocalRegister);
      expect(keys).toEqual(expect.arrayContaining(required));
    });
  });
});
