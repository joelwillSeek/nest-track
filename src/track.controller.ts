import { Controller, Post, Body, Req, Res, Inject } from '@nestjs/common';
import { TrackService } from './track.service';
import { TRACK_MODULE_OPTIONS } from './track.constants';
import type { TrackModuleOptions } from './track.types';
import { detectPlatform } from './detect-platform';

export class TrackPlatformDto {
  eventName!: string;
  metadata?: Record<string, unknown>;
}

const defaultGetUserId = (req: any) =>
  req.user?.userId ?? req.user?.sub ?? null;

@Controller('track-from-platform')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    @Inject(TRACK_MODULE_OPTIONS) private readonly options: TrackModuleOptions,
  ) { }

  @Post()
  async trackEvent(
    @Body() body: TrackPlatformDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const getUserId = this.options.getUserId ?? defaultGetUserId;
    const detectCategory = this.options.detectCategory ?? detectPlatform;

    const userId = getUserId(req, res);
    const ua =
      typeof req.headers?.['user-agent'] === 'string'
        ? req.headers['user-agent']
        : '';
    const category = detectCategory(ua);

    await this.trackService.createTrackEvent({
      eventName: body.eventName,
      category,
      userId,
      metadata: body.metadata,
      source: 'frontend',
    });

    return { success: true };
  }
}
