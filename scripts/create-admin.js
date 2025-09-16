const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // 기존 admin 사용자 확인
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('✅ Admin 사용자가 이미 존재합니다:', existingAdmin.email);
      return;
    }

    // Admin 사용자 생성
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        id: 'admin@example.com',      // 이메일을 ID로 사용
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✅ Admin 사용자가 생성되었습니다:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    
  } catch (error) {
    console.error('❌ Admin 사용자 생성 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
