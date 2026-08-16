import { DynamicModule, Module } from '@nestjs/common';
import { TrackService, TRACK_STORE } from './track.service';

interface SimpleTrackOptions {
  store: {
    create(event: { eventName: string; userId: string; metadata: Record<string, unknown> }): Promise<unknown>;
  };
}

@Module({})
export class TrackModule {
  static forRoot(options: SimpleTrackOptions): DynamicModule {
    return {
      module: TrackModule,
      global: true,
      providers: [
        {
          provide: TRACK_STORE,
          useValue: options.store,
        },
        TrackService,
      ],
      exports: [TrackService],
    };
  }

  static forRootAsync(config: {
    useFactory: (...args: any[]) => SimpleTrackOptions | Promise<SimpleTrackOptions>;
    inject?: any[];
    imports?: any[];
  }): DynamicModule {
    return {
      module: TrackModule,
      global: true,
      imports: config.imports ?? [],
      providers: [
        {
          provide: TRACK_STORE,
          useFactory: async (...args: any[]) => {
            const options = await config.useFactory(...args);
            return options.store;
          },
          inject: config.inject ?? [],
        },
        TrackService,
      ],
      exports: [TrackService],
    };
  }
}