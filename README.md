# nest-track

NestJS request analytics: decorate handlers with `@Track()`, record events through a pluggable **store** (no Prisma/ORM coupling).

## Install

```bash
pnpm add nest-track
# or: npm install nest-track
```

Peer dependencies: `@nestjs/common`, `@nestjs/core`, `rxjs`, `reflect-metadata`.

## Quick start

```ts
import { Module } from '@nestjs/common';
import { TrackModule } from 'nest-track';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    TrackModule.forRootAsync({
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        // Optional allow-list (omit to allow any string)
        eventNames: ['USER_LOGIN', 'SIGN_UP', 'PAGE_VIEW', 'BUTTON_CLICK'],
        // Optional — customize how user id is read from the request
        getUserId: (req) => req.user?.userId ?? req.user?.sub ?? null,
        store: {
          create: (event) =>
            prisma.trackEvent.create({
              data: {
                eventName: event.eventName,
                category: event.category,
                userId: event.userId ?? undefined,
                metadata: event.metadata ?? undefined,
              },
            }),
        },
      }),
    }),
  ],
})
export class AppModule {}
```

On controllers:

```ts
import { UseInterceptors, Post } from '@nestjs/common';
import { Track, TrackInterceptor } from 'nest-track';

@UseInterceptors(TrackInterceptor)
@Controller('auth')
export class AuthController {
  @Track('USER_LOGIN')
  @Post('login')
  login() { /* ... */ }
}
```

`TrackModule` is **global by default** (`isGlobal: true`), so feature modules do not need to re-import it.

## Options

| Option | Description |
|--------|-------------|
| `store` | **Required.** `{ create(event) => ... }` persistence |
| `eventNames` | Optional allow-list of event name strings |
| `strictEventNames` | If `true` + `eventNames` set, unknown names are skipped |
| `getUserId` | `(req) => string \| null` — default `userId` / `sub` |
| `detectCategory` | `(userAgent) => string` — default `"mobile"` for Dart/Flutter UA, else `"web"` |
| `isGlobal` | Default `true` |

## Platforms (`category`)

By default, `category` is inferred from User-Agent via `detectPlatform`:

| Value | Typical signal |
|--------|----------------|
| `flutter` | `Dart/` / `dart:io` |
| `react-native` | `ReactNative` / `react-native` |
| `electron` | `Electron` |
| `android` | `Android` / `okhttp` |
| `ios` | iPhone / iPad / iPod |
| `windows` / `macos` / `linux` | Desktop OS in UA |
| `chrome` / `firefox` / `safari` / `edge` / `opera` | Browser when OS is unclear |
| `web` | Generic Mozilla UA |
| `unknown` | Empty User-Agent only |
| *(raw UA)* | Non-empty UA that matched nothing above |

Override with `detectCategory` in `TrackModule.forRoot`.

## Database (you own the table)

This package does **not** create tables. Add a model to your ORM and migrate yourself.

### Suggested Prisma schema

Copy into your `schema.prisma`, then run your usual migrate:

```prisma
model TrackEvent {
  id        String   @id @default(uuid())
  category  String
  eventName String
  userId    String?
  metadata  Json?
  createdAt DateTime @default(now())

  // Optional: wire to your User model if you want a relation
  // user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

Use `String` for `eventName` / `category` so you can pass custom names from `TrackModule` without regenerating Prisma enums. If you prefer enums, cast in your `store.create` mapper.

## Local development (before publishing)

From an app in the same workspace:

```json
{
  "dependencies": {
    "nest-track": "file:../nest-track"
  }
}
```

```bash
cd nest-track && pnpm build
cd ../your-app && pnpm install
```

## Publish

```bash
pnpm build
pnpm publish --access public
```
