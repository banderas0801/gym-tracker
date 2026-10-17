import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gym Tracker Pro — Nhật Ký Thể Hình',
    short_name: 'GymTracker',
    description:
      'Ứng dụng theo dõi bài tập gym, ghi chép tải tăng tiến (Progressive Overload), công thức tạ cho người mới và phân tích chỉ số hình thể chuẩn khoa học.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#000000',
    theme_color: '#000000',
    categories: ['fitness', 'health', 'sports'],
    icons: [
      {
        src: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
