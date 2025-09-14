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
  Checkbox, 
  Button, 
  ErrorMessage 
} from '@/components/Form';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // 에러 메시지 초기화
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 회원가입 성공
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/login'); // 로그인 페이지로 리다이렉션
      } else {
        setError(data.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Layout
      style={{
        '--checkbox-tick-svg': "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(16,21,24)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')",
      } as React.CSSProperties}
    >
      <Header>
        <Logo />
        <Navigation>
          <NavLinks>
            <NavLink href="#">Home</NavLink>
            <NavLink href="#">About</NavLink>
            <NavLink href="#">Contact</NavLink>
          </NavLinks>
          <a
            href="/login"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d4dce2] transition-colors"
          >
            <span className="truncate">Log In</span>
          </a>
        </Navigation>
      </Header>
      <PageContainer>
        <ContentContainer maxWidth="sm">
            <h2 className="text-[#101518] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Create Your Account</h2>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormField>
                  <Label>
                    <LabelText>Full Name</LabelText>
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </Label>
                </FormField>

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
                      placeholder="Create a password"
                      required
                    />
                  </Label>
                </FormField>

                <FormField>
                  <Label>
                    <LabelText>Confirm Password</LabelText>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </Label>
                </FormField>

                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  label="I agree to the Terms of Service and Privacy Policy"
                  required
                />

                <div className="flex py-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    fullWidth
                  >
                    {isLoading ? '처리 중...' : 'Sign Up'}
                  </Button>
                </div>
              </FormGroup>
            </form>
            <p className="text-[#5c758a] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Already have an account? <a href="/login" className="text-[#9cc0de] hover:underline">Log in</a>
            </p>
        </ContentContainer>
      </PageContainer>
    </Layout>
  );
}
