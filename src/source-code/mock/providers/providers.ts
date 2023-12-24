import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfileService } from 'src/account/profile/profile.service';
import { UserModel } from 'src/source-code/entities/user.entity';
import { MockUserModel } from '../entities/user.mock';
import { AuthService } from 'src/common/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

export const providers = [
  AuthService,
  JwtService,
  ProfileService,
  {
    provide: getRepositoryToken(UserModel),
    useClass: MockUserModel,
  },
];