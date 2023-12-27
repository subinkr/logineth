import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.entity';
import { Exclude } from 'class-transformer';
import { Role } from '../enum/role';
import { Provider } from '../enum/provider';
import { ApiProperty } from '@nestjs/swagger';
import { MockUserModel } from '../mock/entities/user.mock';

@Entity()
export class UserModel extends BaseModel {
  @ApiProperty({ example: MockUserModel.user.username, required: false })
  @Column()
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ example: MockUserModel.user.nickname, required: false })
  @Column()
  nickname: string;

  @ApiProperty({ example: MockUserModel.user.image, required: false })
  @Column({ nullable: true })
  image?: string;

  @ApiProperty({ example: MockUserModel.user.bio, required: false })
  @Column({ nullable: true })
  bio?: string;

  @ApiProperty({
    example: MockUserModel.user.role,
    required: false,
    default: Role.USER,
  })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: string;

  @ApiProperty({
    example: MockUserModel.user.provider,
    required: false,
    default: Provider.LOCAL,
  })
  @Column({ type: 'enum', enum: Provider, default: Provider.LOCAL })
  provider: string;
}
