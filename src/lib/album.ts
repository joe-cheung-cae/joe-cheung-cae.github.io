export type AlbumCountCopy = {
  en: string;
  zh: string;
};

export function isAlbumEmpty(items: readonly unknown[]): boolean {
  return items.length === 0;
}

export function formatAlbumCount(count: number): AlbumCountCopy {
  const n = Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  return {
    en: n === 1 ? '1 photo' : `${n} photos`,
    zh: `${n} 张照片`,
  };
}

export function albumEmptyCopy(): AlbumCountCopy {
  return {
    en: 'No photos yet. This album is reserved for CAE and HPC snapshots.',
    zh: '暂无照片。相册留给计算力学与高性能计算的现场记录。',
  };
}
