export { TrackModule } from './track.module';
export { TrackInterceptor } from './track.interceptor';
export { TrackService } from './track.service';
export { Track } from './track.decorator';
export type { TrackEventMeta } from './track.decorator';
export { TRACK_MODULE_OPTIONS, TRACK_EVENT_KEY } from './track.constants';
export { detectPlatform, TRACK_PLATFORMS } from './detect-platform';
export type { TrackPlatform } from './detect-platform';
export type {
  TrackEventPayload,
  TrackStore,
  TrackGetUserId,
  TrackDetectCategory,
  TrackModuleOptions,
  TrackModuleAsyncOptions,
} from './track.types';
