import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MockUserModel } from '../../source-code/mock/entities/user.mock';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from 'src/account/profile/profile.service';
import { providers } from 'src/source-code/mock/providers/providers';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let profileService: ProfileService;
  const { user, accessToken } = MockUserModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers,
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    profileService = module.get<ProfileService>(ProfileService);
  });

  // STTEST: - use
  describe('Sign Token', () => {
    it('Use | getUserByID', async () => {
      profileService.getUserByID = jest.fn().mockReturnValue(user);
      await service.signToken(user.id);
      expect(profileService.getUserByID).toHaveBeenCalled();
    });

    it('Use | sign', async () => {
      jest.spyOn(jwtService, 'sign');
      profileService.getUserByID = jest.fn().mockReturnValue(accessToken);
      await service.signToken(user.id);
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  // VTTEST: - use
  describe('Verify Token', () => {
    it('Use | verify', async () => {
      jwtService.verify = jest.fn().mockReturnValue(true);
      service.verifyToken(`Bearer ${accessToken}`);
      expect(jwtService.verify).toHaveBeenCalled();
    });
  });

  // HPTEST: - return
  describe('Hash Password', () => {
    it('Return | {hashPassword: string}', async () => {
      const { hashPassword } = await service.hashPassword('p@ssw0rd');
      const verify = await bcrypt.compare('p@ssw0rd', hashPassword);
      expect(verify).toBeTruthy();
    });
  });

  // VPTEST: - return
  describe('Verify Password', () => {
    it('Return | boolean', async () => {
      const result = await service.verifyPassword('p@ssw0rd', user.password);
      expect(result).toBeTruthy();
    });

    it('Error | Result is false', async () => {
      const result = service.verifyPassword('password', user.password);
      await expect(result).rejects.toThrow(BadRequestException);
    });
  });
});
