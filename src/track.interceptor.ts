import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TRACK_EVENT_KEY, TRACK_MODULE_OPTIONS } from './track.constants';
import { TrackEventMeta } from './track.decorator';
import { TrackService } from './track.service';
import { detectPlatform } from './detect-platform';
import {
  TrackDetectCategory,
  TrackGetUserId,
  type TrackModuleOptions,
} from './track.types';

const defaultGetUserId: TrackGetUserId = (req) =>
  req.user?.userId ?? req.user?.sub ?? null;

@Injectable()
export class TrackInterceptor implements NestInterceptor {
  private readonly getUserId: TrackGetUserId;
  private readonly detectCategory: TrackDetectCategory;

  constructor(
    private readonly trackService: TrackService,
    private readonly reflector: Reflector,
    @Inject(TRACK_MODULE_OPTIONS) options: TrackModuleOptions,
  ) {
    this.getUserId = options.getUserId ?? defaultGetUserId;
    this.detectCategory = options.detectCategory ?? detectPlatform;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() === 'http') {
      const httpReq = context.switchToHttp().getRequest();
      if (httpReq.url?.includes('track-from-platform')) {
        return next.handle();
      }
    }

    const meta = this.reflector.get<TrackEventMeta | undefined>(
      TRACK_EVENT_KEY,
      context.getHandler(),
    );

    if (!meta) return next.handle();

    const req: Parameters<TrackGetUserId>[0] = context
      .switchToHttp()
      .getRequest();

    const res: Parameters<TrackGetUserId>[1] = context
      .switchToHttp()
      .getResponse();
    const ua =
      typeof req.headers?.['user-agent'] === 'string'
        ? req.headers['user-agent']
        : '';
    const category = this.detectCategory(ua);

    return next.handle().pipe(
      tap({
        next: () => {
          const userId = this.getUserId(req, res);
          void this.trackService
            .createTrackEvent({
              eventName: meta.eventName,
              category,
              userId,
              metadata: meta.metadata,
              source: 'backend',
            })
            .catch((err: unknown) =>
              console.error('[TrackInterceptor] Failed to record event:', err),
            );
        },
      }),
    );
  }
}
