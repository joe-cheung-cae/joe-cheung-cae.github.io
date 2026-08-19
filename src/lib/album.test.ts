import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { albumEmptyCopy, formatAlbumCount, isAlbumEmpty } from './album.ts';

describe('isAlbumEmpty', () => {
  test('treats an empty list as empty', () => {
    assert.equal(isAlbumEmpty([]), true);
  });

  test('treats a src item as present even without href', () => {
    assert.equal(
      isAlbumEmpty([
        {
          src: '/album/solver-screenshot.png',
          altEn: 'GPU particle solver screenshot',
          altZh: 'GPU 粒子求解器截图',
        },
      ]),
      false
    );
  });

  test('treats a linked item as present', () => {
    assert.equal(
      isAlbumEmpty([
        {
          src: '/album/hpc-cluster.png',
          altEn: 'HPC cluster rack',
          altZh: '高性能计算集群机柜',
          href: '/projects',
        },
      ]),
      false
    );
  });
});

describe('formatAlbumCount', () => {
  test('formats zero, one, and many photos in both languages', () => {
    assert.deepEqual(formatAlbumCount(0), { en: '0 photos', zh: '0 张照片' });
    assert.deepEqual(formatAlbumCount(1), { en: '1 photo', zh: '1 张照片' });
    assert.deepEqual(formatAlbumCount(12), { en: '12 photos', zh: '12 张照片' });
  });
});

describe('albumEmptyCopy', () => {
  test('returns bilingual Joe-voiced copy', () => {
    const copy = albumEmptyCopy();
    assert.ok(copy.en.length > 0);
    assert.ok(copy.zh.length > 0);
    assert.equal(/simon/i.test(`${copy.en}${copy.zh}`), false);
  });
});
