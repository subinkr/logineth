import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/source-code/entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileService } from '../profile/profile.service';
import { ResFollowing } from './dto/res-following.dto';
import { ResUnFollowing } from './dto/res-un-following.dto';
import { RoomModel } from 'src/source-code/entities/room.entity';
import { ResGetFollowingUsers } from './dto/res-get-following-users.dto';
import { ResGetFollowerUsers } from './dto/res-get-follower-users.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
    @InjectRepository(RoomModel)
    private readonly roomRepo: Repository<RoomModel>,
    private readonly profileService: ProfileService,
  ) {}

  // FSERVICE: - {message: string}
  async following(
    targetUserID: number,
    loginUserID: number,
  ): Promise<ResFollowing> {
    if (targetUserID === loginUserID) {
      throw new ForbiddenException('자기 자신을 팔로우 할 수 없습니다.');
    }

    const { user: loginUser } =
      await this.profileService.getUserByID(loginUserID);
    const { user: targetUser } =
      await this.profileService.getUserByID(targetUserID);

    const followingUsers = await loginUser.followingUsers;
    const followingIdx = followingUsers.findIndex(
      (user) => user.id === targetUserID,
    );
    if (followingIdx !== -1) {
      throw new BadRequestException('이미 팔로우 중입니다.');
    }

    loginUser.followingUsers = Promise.resolve([...followingUsers, targetUser]);
    await this.userRepo.save(loginUser);

    const rooms = await loginUser.rooms;
    const [smallID, bigID] = [targetUserID, loginUserID].sort((a, b) => a - b);
    const roomIdx = rooms.findIndex(
      (room) => room.name === `${smallID}-${bigID}`,
    );
    if (roomIdx === -1) {
      await this.roomRepo.save({
        name: `${smallID}-${bigID}`,
        users: Promise.resolve([loginUser, targetUser]),
      });
    }

    return { message: '팔로우 성공' };
  }

  // UFSERVICE: - {message: string}
  async unFollowing(
    targetUserID: number,
    loginUserID: number,
  ): Promise<ResUnFollowing> {
    if (targetUserID === loginUserID) {
      throw new ForbiddenException('자기 자신을 언팔로우 할 수 없습니다.');
    }

    const { user: loginUser } =
      await this.profileService.getUserByID(loginUserID);

    const followingUsers = await loginUser.followingUsers;
    const followingIdx = followingUsers.findIndex(
      (user) => user.id === targetUserID,
    );
    if (followingIdx === -1) {
      throw new BadRequestException('이미 언팔로우 했습니다.');
    }

    followingUsers.splice(followingIdx, 1);
    loginUser.followingUsers = Promise.resolve(followingUsers);
    await this.userRepo.save(loginUser);

    const rooms = await loginUser.rooms;
    const followerUsers = await loginUser.followerUsers;
    const [smallID, bigID] = [targetUserID, loginUserID].sort((a, b) => a - b);

    const roomIdx = rooms.findIndex(
      (room) => room.name === `${smallID}-${bigID}`,
    );
    const followerIdx = followerUsers.findIndex(
      (user) => user.id === loginUserID,
    );
    if (roomIdx !== -1 && followerIdx === -1) {
      await this.roomRepo.delete(rooms[roomIdx].id);
    }

    return { message: '언팔로우 성공' };
  }

  // FUSERVICE: - {followingUsers: UserModel[]}
  async getFollowingUsers(loginUserID: number): Promise<ResGetFollowingUsers> {
    const { user: loginUser } =
      await this.profileService.getUserByID(loginUserID);
    const followingUsers = await loginUser.followingUsers;

    return { followingUsers };
  }

  // FUSERVICE: - {followerUsers: UserModel[]}
  async getFollowerUsers(loginUserID: number): Promise<ResGetFollowerUsers> {
    const { user: loginUser } =
      await this.profileService.getUserByID(loginUserID);
    const followerUsers = await loginUser.followerUsers;

    return { followerUsers };
  }
}
