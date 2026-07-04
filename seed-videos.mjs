import mysql from 'mysql2/promise';

const pool = await mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const conn = await pool.getConnection();

const videos = [
  {
    title: 'ملابس نسائية فاخرة',
    description: 'تشكيلة حصرية من الملابس النسائية الفاخرة والعصرية',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=ملابس+نسائية',
    duration: 60,
    displayOrder: 1,
    isActive: true,
    category: 'ملابس نسائية'
  },
  {
    title: 'ملابس رجالية',
    description: 'أفضل تشكيلة من الملابس الرجالية الكلاسيكية والحديثة',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=ملابس+رجالية',
    duration: 60,
    displayOrder: 2,
    isActive: true,
    category: 'ملابس رجالية'
  },
  {
    title: 'ملابس أطفال والرضع',
    description: 'ملابس آمنة وناعمة لأطفالك الصغار',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=ملابس+أطفال',
    duration: 60,
    displayOrder: 3,
    isActive: true,
    category: 'ملابس أطفال'
  },
  {
    title: 'ذهب إيطالي مكفول اللون',
    description: 'مجوهرات ذهبية إيطالية الصنع بجودة عالية',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=ذهب+إيطالي',
    duration: 60,
    displayOrder: 4,
    isActive: true,
    category: 'مجوهرات'
  },
  {
    title: 'أدوات منزلية',
    description: 'أدوات منزلية عملية وأنيقة لتنظيم منزلك',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=أدوات+منزلية',
    duration: 60,
    displayOrder: 5,
    isActive: true,
    category: 'أدوات منزلية'
  },
  {
    title: 'إلكترونيات وتقنيات',
    description: 'أحدث الأجهزة الإلكترونية والتقنيات الحديثة',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=إلكترونيات',
    duration: 60,
    displayOrder: 6,
    isActive: true,
    category: 'إلكترونيات'
  },
  {
    title: 'أدوات عناية شخصية وكريمات',
    description: 'منتجات عناية شخصية طبيعية وآمنة',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=عناية+شخصية',
    duration: 60,
    displayOrder: 7,
    isActive: true,
    category: 'عناية شخصية'
  },
  {
    title: 'مكياج وتجميل',
    description: 'أفضل ماركات المكياج والتجميل العالمية',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/Sintel.mp4',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=مكياج',
    duration: 60,
    displayOrder: 8,
    isActive: true,
    category: 'مكياج'
  },
  {
    title: 'كفرات وبياضات سرير',
    description: 'كفرات وبياضات سرير فاخرة وناعمة',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=بياضات+سرير',
    duration: 60,
    displayOrder: 9,
    isActive: true,
    category: 'بياضات'
  },
  {
    title: 'أثاث مستعمل شبه جديد',
    description: 'أثاث مستعمل بحالة ممتازة وأسعار مناسبة',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://via.placeholder.com/400x300?text=أثاث+مستعمل',
    duration: 60,
    displayOrder: 10,
    isActive: true,
    category: 'أثاث'
  }
];

try {
  for (const video of videos) {
    await conn.execute(
      'INSERT INTO showcaseVideos (title, description, videoUrl, thumbnailUrl, duration, displayOrder, isActive, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [video.title, video.description, video.videoUrl, video.thumbnailUrl, video.duration, video.displayOrder, video.isActive, video.category]
    );
  }
  console.log('✅ تم إضافة 10 فيديوهات تجريبية بنجاح!');
} catch (error) {
  console.error('❌ خطأ:', error.message);
} finally {
  await conn.release();
  await pool.end();
}
