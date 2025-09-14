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

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/user/chat'); // 채팅 페이지로 리다이렉션
      } else {
        setError(data.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.');
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
          </NavLinks>
          <a
            href="/"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d4dce2] transition-colors"
          >
            <span className="truncate">Sign Up</span>
          </a>
        </Navigation>
      </Header>
      <PageContainer>
        <ContentContainer maxWidth="sm">
            <h2 className="text-[#101518] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Welcome back</h2>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormField>
                  <Label>
                    <LabelText>Email</LabelText>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
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
                      placeholder="Enter your password"
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
                    {isLoading ? '처리 중...' : 'Sign In'}
                  </Button>
                </div>
              </FormGroup>
            </form>
            
            {/* Admin Sign In 버튼 */}
            <div className="flex px-4 py-3">
              <a
                href="/admin/login"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#5c758a] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#4a5f73] transition-colors"
              >
                <span className="truncate">Admin Login</span>
              </a>
            </div>
            
            <p className="text-[#5c758a] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Don't have an account? <a href="/" className="text-[#9cc0de] hover:underline">Sign up</a>
            </p>
        </ContentContainer>
      </PageContainer>
    </Layout>
  );
}
