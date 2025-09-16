"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  totalQuestions: number;
  totalTokens: number;
}

interface UserStats {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
  stats: {
    totalQuestions: number;
    totalTokens: number;
    modelStats: Array<{
      provider: string;
      questionCount: number;
      tokenCount: number;
    }>;
    dailyStats: Array<{
      date: string;
      count: number;
      tokens: number;
    }>;
    monthlyStats: Array<{
      month: string;
      count: number;
      tokens: number;
    }>;
  };
}

export default function UserManagementPage() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    console.log("관리자 로그아웃 처리");
    setShowLogoutConfirm(false);
    // 관리자 토큰 제거
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = "/admin/login";
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowLogoutConfirm(false);
    }
  };

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    try {
      console.log('👥 사용자 목록 조회 시작');
      const response = await fetch('/api/admin/user-stats');
      
      if (!response.ok) {
        throw new Error(`사용자 목록 조회 실패: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ 사용자 목록 수신:', data);
      setUsers(data.users);
    } catch (error) {
      console.error('❌ 사용자 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 선택된 사용자의 통계 가져오기
  const fetchUserStats = async (userId: string) => {
    if (!userId) return;
    
    setStatsLoading(true);
    try {
      console.log('📊 사용자 통계 조회 시작:', userId);
      const response = await fetch(`/api/admin/user-stats?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`사용자 통계 조회 실패: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ 사용자 통계 수신:', data);
      setUserStats(data);
    } catch (error) {
      console.error('❌ 사용자 통계 조회 오류:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // 사용자 선택 변경 핸들러
  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    if (userId) {
      fetchUserStats(userId);
    } else {
      setUserStats(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 막대 그래프 생성 함수
  const generateBarChart = (data: number[], maxValue: number, color: string = "#93C5FD") => {
    const width = 400;
    const height = 150;
    const barWidth = width / data.length * 0.4;
    const barSpacing = width / data.length;
    
    return data.map((value, index) => {
      const barHeight = (value / maxValue) * height;
      const x = index * barSpacing + (barSpacing - barWidth) / 2;
      const y = height - barHeight;
      
      return (
        <rect
          key={index}
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          fill={color}
          opacity="0.7"
        />
      );
    });
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
      style={{
        fontFamily: 'Inter, "Noto Sans", sans-serif'
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaeef1] px-10 py-3">
          <div className="flex items-center gap-4 text-[#101518]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em]">AI Model Recommender</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/admin/model-management">Model Management</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/admin/user-management">User Management</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/admin/statistics">Statistics</a>
            </div>
            <div 
              className="bg-gray-300 rounded-full size-10 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors relative"
              onClick={handleLogout}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#6B7280"/>
              </svg>
              
              {/* 로그아웃 확인 팝업 */}
              {showLogoutConfirm && (
                <div className="absolute top-12 right-0 bg-white rounded-lg p-4 shadow-lg border border-gray-200 z-50 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#F59E0B"/>
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">로그아웃</h3>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">정말 로그아웃하시겠습니까?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={confirmLogout}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      예
                    </button>
                    <button
                      onClick={cancelLogout}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                    >
                      아니오
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] py-5 px-4">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">User Management</p>
            </div>
            
            {/* 사용자 선택 드롭다운 */}
            <div className="px-4 py-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-[#101518] text-base font-medium leading-normal">
                    사용자 선택:
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => handleUserChange(e.target.value)}
                    className="px-4 py-2 border border-[#d4dce2] rounded-lg bg-white text-[#101518] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[300px]"
                    disabled={loading}
                  >
                    <option value="">사용자를 선택하세요</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email} ({user.totalQuestions} questions, {user.totalTokens.toLocaleString()} tokens)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 로딩 상태 */}
            {loading && (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-lg">사용자 목록을 불러오는 중...</div>
              </div>
            )}

            {/* 사용자 통계 표시 */}
            {selectedUserId && userStats && (
              <div className="px-4 py-6">
                <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] mb-4">
                  {userStats.user.name || userStats.user.email} 사용자 통계
                </h3>
                
                {/* 기본 통계 */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d4dce2]">
                    <p className="text-[#101518] text-base font-medium leading-normal">Total Questions</p>
                    <p className="text-[#101518] tracking-light text-2xl font-bold leading-tight">
                      {userStats.stats.totalQuestions.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d4dce2]">
                    <p className="text-[#101518] text-base font-medium leading-normal">Total Tokens</p>
                    <p className="text-[#101518] tracking-light text-2xl font-bold leading-tight">
                      {userStats.stats.totalTokens.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d4dce2]">
                    <p className="text-[#101518] text-base font-medium leading-normal">Joined Date</p>
                    <p className="text-[#101518] tracking-light text-lg font-bold leading-tight">
                      {new Date(userStats.user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* 모델별 사용량 */}
                {userStats.stats.modelStats.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[#101518] text-base font-bold leading-tight tracking-[-0.015em] mb-4">
                      Questions by AI Model
                    </h4>
                    <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#d4dce2] p-6">
                      <div className="grid min-h-[120px] gap-x-4 gap-y-6 grid-cols-[auto_1fr_auto] items-center py-3">
                        {userStats.stats.modelStats.map((model, index) => {
                          const maxQuestions = Math.max(...userStats.stats.modelStats.map(m => m.questionCount), 1);
                          const percentage = (model.questionCount / maxQuestions) * 100;
                          const modelName = model.provider === 'openai' ? 'ChatGPT' : 
                                          model.provider === 'grok' ? 'Grok' : 
                                          model.provider === 'gemini' ? 'Gemini' : 
                                          model.provider;
                          
                          // 각 모델별 색상 설정
                          const getModelColor = (provider: string) => {
                            switch (provider) {
                              case 'openai': return '#10B981'; // 초록색
                              case 'gemini': return '#3B82F6'; // 파란색
                              case 'grok': return '#F59E0B'; // 주황색
                              default: return '#6B7280'; // 회색
                            }
                          };
                          
                          return (
                            <React.Fragment key={index}>
                              <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">{modelName}</p>
                              <div className="h-full flex-1">
                                <div 
                                  className="border-r-2 h-full" 
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: getModelColor(model.provider),
                                    opacity: 0.7
                                  }}
                                ></div>
                              </div>
                              <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em] ml-2">
                                {model.questionCount.toLocaleString()}
                              </p>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 일별 통계 */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#d4dce2] p-6">
                    <p className="text-[#101518] text-base font-medium leading-normal">Daily Questions</p>
                    <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight truncate">
                      {userStats.stats.dailyStats[userStats.stats.dailyStats.length - 1]?.count || 0}
                    </p>
                    <div className="flex gap-1">
                      <p className="text-[#5c758a] text-base font-normal leading-normal">Today</p>
                    </div>
                    <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                      <svg width="100%" height="148" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        {(() => {
                          const dailyCounts = userStats.stats.dailyStats.map(stat => stat.count);
                          const maxCount = Math.max(...dailyCounts, 1);
                          return generateBarChart(dailyCounts, maxCount, "#F59E0B");
                        })()}
                      </svg>
                      <div className="flex justify-around">
                        {userStats.stats.dailyStats.map((stat, index) => {
                          const date = new Date(stat.date);
                          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                          const dayName = dayNames[date.getDay()];
                          return (
                            <p key={index} className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                              {dayName}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 통계 로딩 상태 */}
            {statsLoading && (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-lg">사용자 통계를 불러오는 중...</div>
              </div>
            )}

            {/* 사용자 미선택 상태 */}
            {!selectedUserId && !loading && (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">사용자 선택</h3>
                  <p className="text-gray-500 text-sm">위의 드롭다운에서 사용자를 선택하여 통계를 확인하세요.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
