'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, PageContainer, ContentContainer } from '@/components/Layout';
import { Header, Logo, Navigation, NavLinks, NavLink } from '@/components/Header';
import { 
  FormGroup, 
  FormField, 
  Label, 
  LabelText, 
  Input, 
  Button, 
  ErrorMessage 
} from '@/components/Form';

interface AdminLoginFormData {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminLoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 에러 메시지 초기화
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Admin 로그인 시도:', formData);
      
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📊 응답 상태:', response.status);
      console.log('📊 응답 헤더:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('📥 응답 데이터:', data);

      if (response.ok) {
        // 관리자 로그인 성공
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        console.log('✅ Admin 로그인 성공, 리다이렉션 중...');
        router.push('/admin/model-management'); // 관리자 페이지로 리다이렉션
      } else {
        console.log('❌ Admin 로그인 실패:', data.error);
        setError(data.error || '관리자 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('💥 Admin 로그인 오류:', error);
      setError(`네트워크 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Header>
        <Logo />
        <Navigation>
          <NavLinks>
            <NavLink href="/">Home</NavLink>
            <NavLink href="#">About</NavLink>
            <NavLink href="#">Contact</NavLink>
          </NavLinks>
          <a
            href="/login"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d4dce2] transition-colors"
          >
            <span className="truncate">User Login</span>
          </a>
        </Navigation>
      </Header>
      <PageContainer>
        <ContentContainer maxWidth="sm">
            <h2 className="text-[#101518] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Admin Login</h2>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormField>
                  <Label>
                    <LabelText>Admin Email</LabelText>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter admin email"
                      required
                    />
                  </Label>
                </FormField>

                <FormField>
                  <Label>
                    <LabelText>Password</LabelText>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter admin password"
                      required
                    />
                  </Label>
                </FormField>

                <div className="flex px-4 py-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    fullWidth
                  >
                    {isLoading ? '처리 중...' : 'Admin Sign In'}
                  </Button>
                </div>
              </FormGroup>
            </form>
            
            <p className="text-[#5c758a] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
              일반 사용자이신가요? <a href="/login" className="text-[#9cc0de] hover:underline">User Login</a>
            </p>
        </ContentContainer>
      </PageContainer>
    </Layout>
  );
}
