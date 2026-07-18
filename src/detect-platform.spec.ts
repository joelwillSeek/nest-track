import { detectPlatform } from './detect-platform';

describe('detectPlatform', () => {
  it('detects flutter / dart', () => {
    expect(detectPlatform('Dart/3.3 (dart:io)')).toBe('flutter');
  });

  it('detects react-native', () => {
    expect(detectPlatform('MyApp/1.0 ReactNative')).toBe('react-native');
    expect(detectPlatform('Expo/1.0 react-native')).toBe('react-native');
  });

  it('detects electron', () => {
    expect(
      detectPlatform(
        'Mozilla/5.0 (Windows NT 10.0) Electron/28.0.0 Chrome/120.0.0.0',
      ),
    ).toBe('electron');
  });

  it('detects android and ios', () => {
    expect(detectPlatform('okhttp/4.9.0')).toBe('android');
    expect(
      detectPlatform(
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36',
      ),
    ).toBe('android');
    expect(
      detectPlatform(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      ),
    ).toBe('ios');
  });

  it('detects desktop OS', () => {
    expect(
      detectPlatform(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      ),
    ).toBe('windows');
    expect(
      detectPlatform(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
      ),
    ).toBe('macos');
    expect(
      detectPlatform(
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      ),
    ).toBe('linux');
  });

  it('falls back to browser, raw UA, or unknown', () => {
    expect(detectPlatform('Firefox/120.0')).toBe('firefox');
    expect(detectPlatform('CustomClient/1.2.3')).toBe('CustomClient/1.2.3');
    expect(detectPlatform('')).toBe('unknown');
    expect(detectPlatform('   ')).toBe('unknown');
  });
});
