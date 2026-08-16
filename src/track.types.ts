/**
 * Payload passed to the consumer's store on every tracked request.
 * No ORM coupling — map these fields to your own table/columns.
 */
export interface TrackEventPayload {
  eventName: string;
  /** User ID - must be provided (never null). */
  userId: string;
  /** Metadata object containing custom fields like source, platform, etc. */
  metadata: Record<string, unknown>;
}

/**
 * Pluggable persistence. Implement with Prisma, TypeORM, raw SQL, etc.
 */
export interface TrackStore {
  create(event: TrackEventPayload): Promise<unknown>;
}

export type TrackGetUserId = (
  req: {
    user?: { userId?: string; sub?: string; [key: string]: unknown };
    headers?: Record<string, string | string[] | undefined>;
    [key: string]: unknown;
  },
  res?: Record<string, unknown>,
) => string | null | undefined;

export type TrackDetectCategory = (userAgent: string) => string;

export interface TrackModuleOptions {
  /** Required — how events are persisted. */
  store: TrackStore;

  /**
   * Optional allow-list of event names.
   * If set and an unknown name is used, behavior depends on `strictEventNames`.
   */
  eventNames?: readonly string[];

  /**
   * When `eventNames` is set:
   * - `true`  → skip recording unknown names (and log a warning)
   * - `false` → record anyway (default)
   */
  strictEventNames?: boolean;

  /**
   * Extract a user identifier from the request.
   * Called **after** the route handler completes, so `req.user` will be
   * populated by any auth guard that ran. The response object is also
   * provided so you can extract userId from the handler's response body
   * (useful for login/signup endpoints).
   * Default: `req.user?.userId ?? req.user?.sub ?? null`
   */
  getUserId?: TrackGetUserId;

  /**
   * Map User-Agent → category string.
   * Default: {@link detectPlatform} — flutter, react-native, electron,
   * android, ios, windows, macos, linux, chrome, firefox, safari, edge,
   * opera, web, or unknown.
   */
  detectCategory?: TrackDetectCategory;

  /** Register the module globally (default `true`). */
  isGlobal?: boolean;
}

export interface TrackModuleAsyncOptions {
  imports?: any[];

  inject?: any[];

  useFactory: (
    ...args: any[]
  ) => TrackModuleOptions | Promise<TrackModuleOptions>;
  isGlobal?: boolean;
}
