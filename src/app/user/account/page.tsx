"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout, PageContainer, ContentContainer } from '@/components/Layout';
import { Header, Logo, Navigation, NavLinks, NavLink, UserAvatar } from '@/components/Header';
import { FormField, Label, LabelText, Input, Button } from '@/components/Form';
import { ConfirmModal, SuccessModal } from '@/components/Modal';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      console.log('🔍 사용자 정보 조회 시작');
      const response = await fetch('/api/users/me');
      
      console.log('📡 API 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API 에러 응답:', errorData);
        throw new Error(`사용자 정보 조회 실패: ${response.status} - ${errorData.error || '알 수 없는 오류'}`);
      }
      
      const data = await response.json();
      console.log('✅ 사용자 정보 수신:', data);
      console.log('👤 사용자 정보:', data.user);
      setUserInfo(data.user);
    } catch (error) {
      console.error('❌ 사용자 정보 조회 오류:', error);
      console.error('에러 상세:', error instanceof Error ? error.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 사용자 정보가 변경될 때마다 로깅
  useEffect(() => {
    if (userInfo) {
      console.log('🔄 사용자 정보 상태 업데이트:', userInfo);
      console.log('📝 Name placeholder:', userInfo.name);
      console.log('📧 Email placeholder:', userInfo.email);
    }
  }, [userInfo]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      // 로그아웃 API 호출
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // localStorage에서도 토큰 제거
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setShowLogoutConfirm(false);
      
      // 로그인 페이지로 리다이렉션
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // 오류가 발생해도 로그인 페이지로 리다이렉션
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      console.log("🗑️ 계정 삭제 API 호출 시작");
      
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 삭제 API 응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ 삭제 API 에러 응답:', errorData);
        throw new Error(`계정 삭제 실패: ${response.status} - ${errorData.error || '알 수 없는 오류'}`);
      }

      const data = await response.json();
      console.log('✅ 계정 삭제 성공:', data);

      // localStorage에서도 토큰 제거
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      
      // 3초 후 메인 페이지로 리다이렉트
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);

    } catch (error) {
      console.error('❌ 계정 삭제 오류:', error);
      alert(`계정 삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirm(false);
  };

  const closeDeleteSuccess = () => {
    setShowDeleteSuccess(false);
    window.location.href = "/";
  };

  return (
    <Layout>
      <Header>
        <Logo />
        <Navigation>
          <NavLinks>
            <NavLink href="/user/chat">Chat</NavLink>
            <NavLink href="/user/log">Log</NavLink>
            <NavLink href="/user/models">Models</NavLink>
            <NavLink href="/user/account">Account</NavLink>
          </NavLinks>
          <UserAvatar />
        </Navigation>
      </Header>
      <PageContainer>
        <ContentContainer>
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">My Account</p>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Personal Information</h3>
            <div className="max-w-[480px] px-4">
              <FormField>
                <Label>
                  <LabelText>Name</LabelText>
                  <Input 
                    placeholder={loading ? "로딩 중..." : userInfo?.name || "이름을 입력하세요"}
                    disabled={loading}
                    value={userInfo?.name || ""}
                  />
                </Label>
              </FormField>
              <FormField>
                <Label>
                  <LabelText>Email</LabelText>
                  <Input 
                    placeholder={loading ? "로딩 중..." : userInfo?.email || "이메일을 입력하세요"}
                    disabled={loading}
                    value={userInfo?.email || ""}
                  />
                </Label>
              </FormField>
              <FormField>
                <Label>
                  <LabelText>Password</LabelText>
                  <Input 
                    type="password" 
                    placeholder="새 비밀번호를 입력하세요"
                    disabled={loading}
                  />
                </Label>
              </FormField>
              <div className="flex py-3 justify-end">
                <Button>
                  Update Information
                </Button>
              </div>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Subscription</h3>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101518] text-base font-medium leading-normal pb-2">Current Plan</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c758a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#101518] text-base font-medium leading-normal pb-2">Billing Information</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c758a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex px-4 py-3 justify-end">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Manage Subscription</span>
              </button>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Account Actions</h3>
            <div className="flex px-4 py-3 justify-start">
              <Button onClick={handleLogout} variant="secondary">
                Logout
              </Button>
            </div>
            <div className="flex px-4 py-3 justify-start">
              <Button onClick={handleDeleteAccount} variant="secondary" className="text-red-600 hover:text-red-700">
                Delete Account
              </Button>
            </div>
        </ContentContainer>
      </PageContainer>

      {/* 모달들 */}
        <ConfirmModal
          isOpen={showLogoutConfirm}
          onClose={cancelLogout}
          onConfirm={confirmLogout}
          title="로그아웃 확인"
          message="정말로 로그아웃하시겠습니까?"
          confirmText="예"
          cancelText="아니오"
          isLoading={isLoggingOut}
        />

        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={cancelDeleteAccount}
          onConfirm={confirmDeleteAccount}
          title="계정 삭제 확인"
          message="정말로 계정을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다."
          confirmText="예, 삭제합니다"
          cancelText="아니오"
          variant="danger"
          isLoading={isDeleting}
        />

        <SuccessModal
          isOpen={showDeleteSuccess}
          onClose={closeDeleteSuccess}
          title="계정 삭제 완료"
          message="계정이 성공적으로 삭제되었습니다. 3초 후 메인 페이지로 리다이렉트됩니다."
        />
    </Layout>
  );
}
