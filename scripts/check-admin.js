const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    console.log('🔍 Admin 사용자 확인 중...');
    
    const admin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (admin) {
      console.log('✅ Admin 사용자 발견:');
      console.log('   ID:', admin.id);
      console.log('   Email:', admin.email);
      console.log('   Name:', admin.name);
      console.log('   Role:', admin.role);
      console.log('   Created:', admin.createdAt);
    } else {
      console.log('❌ Admin 사용자를 찾을 수 없습니다.');
      
      // 모든 사용자 확인
      const allUsers = await prisma.user.findMany();
      console.log('📋 모든 사용자:');
      allUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role || 'no role'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
