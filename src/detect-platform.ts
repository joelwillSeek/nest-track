/**
 * Known platform labels returned by {@link detectPlatform} when UA matches.
 * Unrecognized non-empty UAs fall back to the raw User-Agent string.
 * Empty UA → `"unknown"`.
 */
export const TRACK_PLATFORMS = [
  'flutter',
  'react-native',
  'electron',
  'android',
  'ios',
  'windows',
  'macos',
  'linux',
  'chrome',
  'firefox',
  'safari',
  'edge',
  'opera',
  'web',
  'unknown',
] as const;

export type TrackPlatform = (typeof TRACK_PLATFORMS)[number];

/**
 * Infer client platform from a User-Agent string.
 *
 * Priority: app frameworks → mobile OS → desktop OS → browser → web.
 * If nothing matches, returns the original UA. Empty UA → `"unknown"`.
 */
export function detectPlatform(userAgent: string): string {
  if (!userAgent?.trim()) return 'unknown';

  const ua = userAgent.toLowerCase();

  // App frameworks / runtimes
  if (ua.includes('dart:io') || ua.includes('dart/')) return 'flutter';
  if (ua.includes('reactnative') || ua.includes('react-native')) {
    return 'react-native';
  }
  if (ua.includes('electron')) return 'electron';

  // Mobile OS (browser, WebView, or common native HTTP clients)
  if (ua.includes('android') || ua.includes('okhttp')) return 'android';
  if (
    ua.includes('iphone') ||
    ua.includes('ipad') ||
    ua.includes('ipod') ||
    (ua.includes('ios') && ua.includes('mobile'))
  ) {
    return 'ios';
  }

  // Desktop OS
  if (ua.includes('windows') || ua.includes('win64') || ua.includes('win32')) {
    return 'windows';
  }
  if (ua.includes('mac os') || ua.includes('macintosh') || ua.includes('macos')) {
    return 'macos';
  }
  if (ua.includes('linux') || ua.includes('x11')) return 'linux';

  // Browsers (when OS was not identified)
  // Edge/Opera before Chrome — their UAs often include "chrome"
  if (ua.includes('edg/') || ua.includes('edgios') || ua.includes('edga')) {
    return 'edge';
  }
  if (ua.includes('opr/') || ua.includes('opera')) return 'opera';
  if (ua.includes('firefox') || ua.includes('fxios')) return 'firefox';
  if (ua.includes('chrome') || ua.includes('crios') || ua.includes('chromium')) {
    return 'chrome';
  }
  if (ua.includes('safari') && !ua.includes('chrome')) return 'safari';

  if (ua.includes('mozilla')) return 'web';

  return userAgent;
}
