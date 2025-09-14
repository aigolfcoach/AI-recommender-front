const bcrypt = require('bcryptjs');

async function testAdminLogin() {
  try {
    console.log('🧪 Admin 로그인 테스트 시작...');
    
    const testData = {
      email: 'admin@example.com',
      password: 'admin123'
    };
    
    console.log('📤 요청 데이터:', testData);
    
    const response = await fetch('http://localhost:3001/api/auth/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('📊 응답 상태:', response.status);
    console.log('📊 응답 헤더:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📥 응답 데이터:', data);
    
    if (response.ok) {
      console.log('✅ Admin 로그인 성공!');
    } else {
      console.log('❌ Admin 로그인 실패:', data.error);
    }
    
  } catch (error) {
    console.error('💥 테스트 중 오류:', error.message);
  }
}

testAdminLogin();
