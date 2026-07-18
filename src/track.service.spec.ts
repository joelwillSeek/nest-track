import { Test, TestingModule } from '@nestjs/testing';
import { TRACK_MODULE_OPTIONS } from './track.constants';
import { TrackService } from './track.service';
import { TrackStore } from './track.types';

describe('TrackService', () => {
  let service: TrackService;
  let store: jest.Mocked<TrackStore>;

  beforeEach(async () => {
    store = { create: jest.fn().mockResolvedValue({ id: '1' }) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackService,
        {
          provide: TRACK_MODULE_OPTIONS,
          useValue: {
            store,
            eventNames: ['USER_LOGIN', 'SIGN_UP'],
            strictEventNames: true,
          },
        },
      ],
    }).compile();

    service = module.get(TrackService);
  });

  it('persists known events via the store', async () => {
    await service.createTrackEvent({
      eventName: 'USER_LOGIN',
      category: 'web',
      userId: 'u1',
    });

    expect(store.create).toHaveBeenCalledWith({
      eventName: 'USER_LOGIN',
      category: 'web',
      userId: 'u1',
    });
  });

  it('skips unknown events when strictEventNames is true', async () => {
    await service.createTrackEvent({
      eventName: 'UNKNOWN',
      category: 'web',
    });

    expect(store.create).not.toHaveBeenCalled();
  });
});
