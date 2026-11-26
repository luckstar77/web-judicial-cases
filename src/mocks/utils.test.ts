import { describe, expect, it } from 'vitest';
import { detectImageType } from './utils';

const bytesOf = (bytes: number[]) => new Uint8Array([...bytes, ...new Array<number>(16).fill(0)]);
const ascii = (text: string) => Array.from(text, (char) => char.charCodeAt(0));

describe('detectImageType', () => {
  it('detects jpeg, png, gif and webp by their magic bytes', () => {
    expect(detectImageType(bytesOf([0xff, 0xd8, 0xff, 0xe0]))).toBe('image/jpeg');
    expect(detectImageType(bytesOf([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe('image/png');
    expect(detectImageType(bytesOf(ascii('GIF89a')))).toBe('image/gif');
    expect(detectImageType(bytesOf(ascii('GIF87a')))).toBe('image/gif');
    expect(detectImageType(bytesOf([...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WEBP')]))).toBe('image/webp');
  });

  it('returns undefined for content that is not a supported image', () => {
    expect(detectImageType(bytesOf(ascii('not an image')))).toBeUndefined();
    expect(detectImageType(bytesOf(ascii('GIF80a')))).toBeUndefined();
    expect(detectImageType(new Uint8Array())).toBeUndefined();
  });
});
