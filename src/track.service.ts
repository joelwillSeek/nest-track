import { Inject, Injectable, Logger } from '@nestjs/common';
import { TRACK_MODULE_OPTIONS } from './track.constants';
import {
  TrackEventPayload,
 type TrackModuleOptions,
  TrackStore,
} from './track.types';

@Injectable()
export class TrackService {
  private readonly logger = new Logger(TrackService.name);
  private readonly store: TrackStore;
  private readonly eventNames?: ReadonlySet<string>;
  private readonly strictEventNames: boolean;

  constructor(
    @Inject(TRACK_MODULE_OPTIONS) options: TrackModuleOptions,
  ) {
    this.store = options.store;
    this.eventNames = options.eventNames
      ? new Set(options.eventNames)
      : undefined;
    this.strictEventNames = options.strictEventNames ?? false;
  }

  async createTrackEvent(event: TrackEventPayload): Promise<unknown> {
    if (this.eventNames && !this.eventNames.has(event.eventName)) {
      const message = `[nest-track] Unknown event name "${event.eventName}". Allowed: ${[...this.eventNames].join(', ')}`;
      if (this.strictEventNames) {
        this.logger.warn(message);
        return;
      }
      this.logger.debug(message);
    }

    return this.store.create(event);
  }
}
