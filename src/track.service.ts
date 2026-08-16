import { Injectable, Inject } from '@nestjs/common';

export const TRACK_STORE = 'TRACK_STORE';

@Injectable()
export class TrackService {
  constructor(
    @Inject(TRACK_STORE) private readonly store: any,
  ) {}

  async track(eventName: string, userId: string, metadata: Record<string, unknown>): Promise<void> {
    await this.store.create({
      eventName,
      userId,
      metadata,
    });
  }
}