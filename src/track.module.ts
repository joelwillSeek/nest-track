import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TRACK_MODULE_OPTIONS } from './track.constants';
import { TrackInterceptor } from './track.interceptor';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TrackModuleAsyncOptions, TrackModuleOptions } from './track.types';

@Module({})
export class TrackModule {
  static forRoot(options: TrackModuleOptions): DynamicModule {
    return {
      module: TrackModule,
      global: options.isGlobal ?? true,
      providers: [
        { provide: TRACK_MODULE_OPTIONS, useValue: options },
        TrackService,
        TrackInterceptor,
      ],
      controllers: [TrackController],
      exports: [TrackService, TrackInterceptor, TRACK_MODULE_OPTIONS],
    };
  }

  static forRootAsync(options: TrackModuleAsyncOptions): DynamicModule {
    const asyncProviders: Provider[] = [
      {
        provide: TRACK_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      },
      TrackService,
      TrackInterceptor,
    ];

    return {
      module: TrackModule,
      global: options.isGlobal ?? true,
      imports: options.imports ?? [],
      providers: asyncProviders,
      controllers: [TrackController],
      exports: [TrackService, TrackInterceptor, TRACK_MODULE_OPTIONS],
    };
  }
}
