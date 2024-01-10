import { Test, TestingModule } from '@nestjs/testing';
import { WsService } from './ws.service';
import { providers } from 'src/source-code/mock/providers/providers';
import { ProfileService } from 'src/account/profile/profile.service';
import { MockUserModel } from 'src/source-code/mock/entities/user.mock';
import { MockRoomModel } from 'src/source-code/mock/entities/room.mock';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { RoomGatewaySendMessage } from './dto/room-gateway-send-message.dto';

describe('WsService', () => {
  let service: WsService;
  let profileService: ProfileService;
  const { user, otherUser } = MockUserModel;
  const { room } = MockRoomModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers,
    }).compile();

    service = module.get<WsService>(WsService);
    profileService = module.get<ProfileService>(ProfileService);
  });

  // GRTEST: - use, error
  describe('Get Room', () => {
    it('Use | getUserByID', async () => {
      profileService.getUserByID = jest.fn().mockReturnValue({ user });
      await service.getRoom(room.id, 1, user.id);
      expect(profileService.getUserByID).toHaveBeenCalled();
    });

    it('Error | Cannot access not included room', async () => {
      const result = service.getRoom(room.id, 1, otherUser.id);
      await expect(result).rejects.toThrow(ForbiddenException);
    });
  });

  // SMTEST: - use, error
  describe('Send Message', () => {
    const roomGatewaySendMessage: RoomGatewaySendMessage = {
      content: 'content',
    };

    it('Use | getUserByID', async () => {
      profileService.getUserByID = jest.fn().mockReturnValue({ user });
      await service.sendMessage(roomGatewaySendMessage, room.id, user.id);
      expect(profileService.getUserByID).toHaveBeenCalled();
    });

    it('Error | Cannot send empty data', async () => {
      const result = service.sendMessage({ content: '' }, room.id, user.id);
      await expect(result).rejects.toThrow(BadRequestException);
    });

    it('Error | Cannot access not included room', async () => {
      const result = service.sendMessage(
        roomGatewaySendMessage,
        room.id,
        otherUser.id,
      );
      await expect(result).rejects.toThrow(ForbiddenException);
    });
  });
});
