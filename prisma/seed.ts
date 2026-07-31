import { PrismaClient } from "../src/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { Role, BookStatus } from "../src/generated/prisma/enums.js"

import bcrypt from 'bcryptjs';

const connectionString = "postgresql://postgres:duc20092004@localhost:5432/bookdb";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding...');

  // ── 1. USERS ───────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Test@1234', 12);

  const [admin, author1, author2, reader1, reader2] = await Promise.all([
    prisma.user.upsert({
      where:  { email: 'admin@bookapp.com' },
      update: {},
      create: {
        email:      'admin@bookapp.com',
        username:   'admin',
        password:   hashedPassword,
        role:       Role.ADMIN,
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where:  { email: 'author1@bookapp.com' },
      update: {},
      create: {
        email:      'author1@bookapp.com',
        username:   'nguyen_van_a',
        password:   hashedPassword,
        role:       Role.AUTHOR,
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where:  { email: 'author2@bookapp.com' },
      update: {},
      create: {
        email:      'author2@bookapp.com',
        username:   'tran_thi_b',
        password:   hashedPassword,
        role:       Role.AUTHOR,
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where:  { email: 'reader1@bookapp.com' },
      update: {},
      create: {
        email:      'reader1@bookapp.com',
        username:   'reader_one',
        password:   hashedPassword,
        role:       Role.READER,
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where:  { email: 'reader2@bookapp.com' },
      update: {},
      create: {
        email:      'reader2@bookapp.com',
        username:   'reader_two',
        password:   hashedPassword,
        role:       Role.READER,
        isVerified: true,
      },
    }),
  ]);

  console.log('✅ Users created');

  // ── 2. GENRES ──────────────────────────────────────
  const genreData = [
    { name: 'Tiểu thuyết',    slug: 'tieu-thuyet' },
    { name: 'Kinh dị',        slug: 'kinh-di' },
    { name: 'Lãng mạn',       slug: 'lang-man' },
    { name: 'Khoa học viễn tưởng', slug: 'khoa-hoc-vien-tuong' },
    { name: 'Phát triển bản thân', slug: 'phat-trien-ban-than' },
    { name: 'Lịch sử',        slug: 'lich-su' },
    { name: 'Trinh thám',     slug: 'trinh-tham' },
  ];

  const genres = await Promise.all(
    genreData.map((g) =>
      prisma.genre.upsert({
        where:  { slug: g.slug },
        update: {},
        create: g,
      })
    )
  );

  const [
    genreTieuThuyet,
    genreKinhDi,
    genreLangMan,
    genreKHVT,
    genrePTBT,
    genreLichSu,
    genreTrinh,
  ] = genres;

  console.log('✅ Genres created');

  // ── 3. BOOKS ───────────────────────────────────────
  const book1 = await prisma.book.upsert({
    where:  { slug: 'dac-nhan-tam' },
    update: {},
    create: {
      title:       'Đắc Nhân Tâm',
      slug:        'dac-nhan-tam',
      description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử của Dale Carnegie.',
      status:      BookStatus.COMPLETED,
      isPublished: true,
      authorId:    author1.id,
      genres: {
        create: [
          { genreId: genrePTBT.id },
          { genreId: genreTieuThuyet.id },
        ],
      },
    },
  });

  const book2 = await prisma.book.upsert({
    where:  { slug: 'sherlock-holmes' },
    update: {},
    create: {
      title:       'Sherlock Holmes',
      slug:        'sherlock-holmes',
      description: 'Những vụ án bí ẩn được phá giải bởi thám tử lừng danh Sherlock Holmes.',
      status:      BookStatus.COMPLETED,
      isPublished: true,
      authorId:    author1.id,
      genres: {
        create: [
          { genreId: genreTrinh.id },
          { genreId: genreTieuThuyet.id },
        ],
      },
    },
  });

  const book3 = await prisma.book.upsert({
    where:  { slug: 'tu-chien-thang' },
    update: {},
    create: {
      title:       'Tư Chiến Thắng',
      slug:        'tu-chien-thang',
      description: 'Câu chuyện chiến đấu và chiến thắng của một người lính trẻ.',
      status:      BookStatus.ONGOING,
      isPublished: true,
      authorId:    author2.id,
      genres: {
        create: [
          { genreId: genreLichSu.id },
          { genreId: genreTieuThuyet.id },
        ],
      },
    },
  });

  const book4 = await prisma.book.upsert({
    where:  { slug: 'nguoi-yeu-bong-toi' },
    update: {},
    create: {
      title:       'Người Yêu Bóng Tối',
      slug:        'nguoi-yeu-bong-toi',
      description: 'Câu chuyện tình yêu bí ẩn giữa ánh sáng và bóng tối.',
      status:      BookStatus.ONGOING,
      isPublished: true,
      authorId:    author2.id,
      genres: {
        create: [
          { genreId: genreLangMan.id },
          { genreId: genreKinhDi.id },
        ],
      },
    },
  });

  console.log('✅ Books created');

  // ── 4. CHAPTERS ────────────────────────────────────
  const book1Chapters = [
    { number: 1, title: 'Chương 1: Nghệ thuật lấy lòng người',       content: 'Bí quyết duy nhất để có được điều tốt nhất từ người khác là khơi dậy trong họ điều tốt nhất. Không có cách nào khác. ' + 'Lorem ipsum '.repeat(200) },
    { number: 2, title: 'Chương 2: Sáu cách tạo thiện cảm',          content: 'Hãy thực sự quan tâm đến người khác. Mỉm cười. Hãy nhớ rằng tên của một người là âm thanh ngọt ngào nhất. ' + 'Lorem ipsum '.repeat(200) },
    { number: 3, title: 'Chương 3: Làm sao để thuyết phục người khác', content: 'Cách duy nhất để thắng trong một cuộc tranh luận là tránh nó. Tôn trọng ý kiến của người khác. ' + 'Lorem ipsum '.repeat(200) },
    { number: 4, title: 'Chương 4: Trở thành người lãnh đạo',         content: 'Bắt đầu bằng lời khen ngợi thành thật. Chỉ ra lỗi lầm một cách gián tiếp. ' + 'Lorem ipsum '.repeat(200) },
  ];

  const book2Chapters = [
    { number: 1, title: 'Vụ án đầu tiên',      content: 'Sherlock Holmes nhìn vào người khách lạ và ngay lập tức biết được nghề nghiệp và quá khứ của ông ta. ' + 'Lorem ipsum '.repeat(150) },
    { number: 2, title: 'Dấu vết bí ẩn',       content: 'Một manh mối nhỏ bé có thể dẫn đến sự thật lớn lao. Holmes theo dõi từng chi tiết nhỏ nhất. ' + 'Lorem ipsum '.repeat(150) },
    { number: 3, title: 'Kẻ tình nghi',         content: 'Watson không thể tin vào mắt mình khi Holmes chỉ ra kẻ phạm tội chỉ từ một vết bùn nhỏ trên giày. ' + 'Lorem ipsum '.repeat(150) },
  ];

  const book3Chapters = [
    { number: 1, title: 'Ngày đầu nhập ngũ',   content: 'Tiếng còi tập hợp vang lên lúc 5 giờ sáng. Anh bước ra khỏi lều với đôi mắt còn ngái ngủ. ' + 'Lorem ipsum '.repeat(150) },
    { number: 2, title: 'Trận chiến đầu tiên', content: 'Đạn bay vèo qua đầu. Anh nép người sau tảng đá và hít một hơi thật sâu để lấy bình tĩnh. ' + 'Lorem ipsum '.repeat(150) },
  ];

  const book4Chapters = [
    { number: 1, title: 'Gặp gỡ trong đêm tối', content: 'Cô gặp anh trong một đêm mưa tầm tã. Ánh đèn đường hắt lên gương mặt anh một vẻ kỳ bí khó tả. ' + 'Lorem ipsum '.repeat(150) },
    { number: 2, title: 'Bí mật của anh',        content: 'Cô bắt đầu nhận ra những điều bất thường. Anh không bao giờ ra ngoài ban ngày. ' + 'Lorem ipsum '.repeat(150) },
  ];

  // Tạo chapters cho từng book
  for (const ch of book1Chapters) {
    await prisma.chapter.upsert({
      where:  { bookId_chapterNumber: { bookId: book1.id, chapterNumber: ch.number } },
      update: {},
      create: {
        bookId:        book1.id,
        chapterNumber: ch.number,
        title:         ch.title,
        content:       ch.content,
        wordCount:     ch.content.split(/\s+/).length,
        isPublished:   true,
      },
    });
  }

  for (const ch of book2Chapters) {
    await prisma.chapter.upsert({
      where:  { bookId_chapterNumber: { bookId: book2.id, chapterNumber: ch.number } },
      update: {},
      create: {
        bookId:        book2.id,
        chapterNumber: ch.number,
        title:         ch.title,
        content:       ch.content,
        wordCount:     ch.content.split(/\s+/).length,
        isPublished:   true,
      },
    });
  }

  for (const ch of book3Chapters) {
    await prisma.chapter.upsert({
      where:  { bookId_chapterNumber: { bookId: book3.id, chapterNumber: ch.number } },
      update: {},
      create: {
        bookId:        book3.id,
        chapterNumber: ch.number,
        title:         ch.title,
        content:       ch.content,
        wordCount:     ch.content.split(/\s+/).length,
        isPublished:   true,
      },
    });
  }

  for (const ch of book4Chapters) {
    await prisma.chapter.upsert({
      where:  { bookId_chapterNumber: { bookId: book4.id, chapterNumber: ch.number } },
      update: {},
      create: {
        bookId:        book4.id,
        chapterNumber: ch.number,
        title:         ch.title,
        content:       ch.content,
        wordCount:     ch.content.split(/\s+/).length,
        isPublished:   true,
      },
    });
  }

  console.log('✅ Chapters created');

  // ── 5. BOOKMARKS ───────────────────────────────────
  // Lấy chapters để bookmark
  const ch1Book1 = await prisma.chapter.findFirst({ where: { bookId: book1.id, chapterNumber: 1 } });
  const ch1Book2 = await prisma.chapter.findFirst({ where: { bookId: book2.id, chapterNumber: 1 } });

  await Promise.all([
    // reader1 bookmark sách
    prisma.bookmark.upsert({
      where:  { userId_bookId_chapterId: { userId: reader1.id, bookId: book1.id, chapterId: '' } },
      update: {},
      create: { userId: reader1.id, bookId: book1.id },
    }),
    prisma.bookmark.upsert({
      where:  { userId_bookId_chapterId: { userId: reader1.id, bookId: book2.id, chapterId: '' } },
      update: {},
      create: { userId: reader1.id, bookId: book2.id },
    }),
    // reader1 bookmark chapter
    ...(ch1Book1 ? [prisma.bookmark.upsert({
      where:  { userId_bookId_chapterId: { userId: reader1.id, bookId: book1.id, chapterId: ch1Book1.id } },
      update: {},
      create: { userId: reader1.id, bookId: book1.id, chapterId: ch1Book1.id },
    })] : []),
    // reader2 bookmark sách
    prisma.bookmark.upsert({
      where:  { userId_bookId_chapterId: { userId: reader2.id, bookId: book3.id, chapterId: '' } },
      update: {},
      create: { userId: reader2.id, bookId: book3.id },
    }),
  ]);

  console.log('✅ Bookmarks created');

  // ── 6. READING PROGRESS ────────────────────────────
  const ch2Book1 = await prisma.chapter.findFirst({ where: { bookId: book1.id, chapterNumber: 2 } });
  const ch2Book2 = await prisma.chapter.findFirst({ where: { bookId: book2.id, chapterNumber: 2 } });

  await Promise.all([
    ch1Book1 && prisma.readingProgress.upsert({
      where:  { userId_bookId: { userId: reader1.id, bookId: book1.id } },
      update: {},
      create: { userId: reader1.id, bookId: book1.id, chapterId: ch1Book1.id, currentPage: 2 },
    }),
    ch2Book2 && prisma.readingProgress.upsert({
      where:  { userId_bookId: { userId: reader1.id, bookId: book2.id } },
      update: {},
      create: { userId: reader1.id, bookId: book2.id, chapterId: ch2Book2.id, currentPage: 1 },
    }),
    ch1Book2 && prisma.readingProgress.upsert({
      where:  { userId_bookId: { userId: reader2.id, bookId: book2.id } },
      update: {},
      create: { userId: reader2.id, bookId: book2.id, chapterId: ch1Book2.id, currentPage: 3 },
    }),
  ]);

  console.log('✅ Reading progress created');

  // ── 7. REVIEWS ─────────────────────────────────────
  await Promise.all([
    prisma.review.upsert({
      where:  { userId_bookId: { userId: reader1.id, bookId: book1.id } },
      update: {},
      create: { userId: reader1.id, bookId: book1.id, rating: 5, content: 'Cuốn sách tuyệt vời! Thay đổi cách nhìn của tôi về giao tiếp.' },
    }),
    prisma.review.upsert({
      where:  { userId_bookId: { userId: reader2.id, bookId: book1.id } },
      update: {},
      create: { userId: reader2.id, bookId: book1.id, rating: 4, content: 'Rất hay, nhưng một số phần hơi lặp lại.' },
    }),
    prisma.review.upsert({
      where:  { userId_bookId: { userId: reader1.id, bookId: book2.id } },
      update: {},
      create: { userId: reader1.id, bookId: book2.id, rating: 5, content: 'Sherlock Holmes mãi là huyền thoại!' },
    }),
    prisma.review.upsert({
      where:  { userId_bookId: { userId: reader2.id, bookId: book3.id } },
      update: {},
      create: { userId: reader2.id, bookId: book3.id, rating: 4, content: 'Câu chuyện hấp dẫn, mong tác giả ra chapter mới sớm.' },
    }),
  ]);

  console.log('✅ Reviews created');

  // ── 8. FOLLOWS ─────────────────────────────────────
  await Promise.all([
    prisma.follow.upsert({
      where:  { userId_bookId: { userId: reader1.id, bookId: book3.id } },
      update: {},
      create: { userId: reader1.id, bookId: book3.id },
    }),
    prisma.follow.upsert({
      where:  { userId_bookId: { userId: reader1.id, bookId: book4.id } },
      update: {},
      create: { userId: reader1.id, bookId: book4.id },
    }),
    prisma.follow.upsert({
      where:  { userId_bookId: { userId: reader2.id, bookId: book3.id } },
      update: {},
      create: { userId: reader2.id, bookId: book3.id },
    }),
    prisma.follow.upsert({
      where:  { userId_bookId: { userId: reader2.id, bookId: book4.id } },
      update: {},
      create: { userId: reader2.id, bookId: book4.id },
    }),
  ]);

  console.log('✅ Follows created');

  // ── 9. NOTIFICATIONS ───────────────────────────────
  await Promise.all([
    prisma.notification.create({
      data: {
        userId:  reader1.id,
        type:    'NEW_CHAPTER',
        title:   'Tư Chiến Thắng có chapter mới!',
        message: 'Chương 2: Trận chiến đầu tiên vừa được đăng',
        metadata: { bookId: book3.id, slug: book3.slug, chapterNumber: 2 },
      },
    }),
    prisma.notification.create({
      data: {
        userId:  reader2.id,
        type:    'NEW_CHAPTER',
        title:   'Người Yêu Bóng Tối có chapter mới!',
        message: 'Chương 2: Bí mật của anh vừa được đăng',
        metadata: { bookId: book4.id, slug: book4.slug, chapterNumber: 2 },
      },
    }),
    prisma.notification.create({
      data: {
        userId:  reader1.id,
        type:    'SYSTEM',
        title:   'Chào mừng đến với BookApp!',
        message: 'Khám phá hàng ngàn cuốn sách hay đang chờ bạn.',
        isRead:  true,
      },
    }),
  ]);

  console.log('✅ Notifications created');

  // ── Summary ────────────────────────────────────────
  console.log(`
╔════════════════════════════════╗
║      🎉 Seed completed!        ║
╠════════════════════════════════╣
║  Accounts (password: Test@1234)║
║  admin@bookapp.com   → ADMIN   ║
║  author1@bookapp.com → AUTHOR  ║
║  author2@bookapp.com → AUTHOR  ║
║  reader1@bookapp.com → READER  ║
║  reader2@bookapp.com → READER  ║
╠════════════════════════════════╣
║  Books: 4                      ║
║  Chapters: 11                  ║
║  Genres: 7                     ║
║  Reviews: 4                    ║
║  Bookmarks: 4                  ║
║  Follows: 4                    ║
║  Notifications: 3              ║
╚════════════════════════════════╝
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());