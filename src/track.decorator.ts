import { SetMetadata } from '@nestjs/common';
import { TRACK_EVENT_KEY } from './track.constants';

export interface TrackEventMeta {
  eventName: string;
  /** Optional static metadata attached to every event from this handler. */
  metadata?: Record<string, unknown>;
}

/**
 * Records an analytics event when the decorated handler completes successfully.
 *
 * @example
 *   @Track('USER_LOGIN')
 *   @Post('login')
 *   async login() { ... }
 */
export const Track = (
  eventName: string,
  metadata?: Record<string, unknown>,
): MethodDecorator =>
  SetMetadata(TRACK_EVENT_KEY, { eventName, metadata } satisfies TrackEventMeta);
