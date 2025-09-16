"use client";

import React, { useState, useEffect } from "react";

interface StatsData {
  users: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    dailyStats: Array<{ date: string; count: number }>;
    monthlyStats: Array<{ month: string; count: number }>;
  };
  usage: {
    totalQuestions: number;
    totalTokens: number;
    dailyQuestionStats: Array<{ date: string; count: number }>;
    monthlyQuestionStats: Array<{ month: string; count: number }>;
    modelStats: Array<{
      provider: string;
      model: string;
      questionCount: number;
      tokenCount: number;
    }>;
  };
}

export default function StatisticsPage() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

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

  // 통계 데이터 가져오기
  const fetchStatsData = async () => {
    try {
      console.log('📊 통계 데이터 조회 시작');
      const response = await fetch('/api/admin/stats');
      
      if (!response.ok) {
        throw new Error(`통계 데이터 조회 실패: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ 통계 데이터 수신:', data);
      setStatsData(data);
    } catch (error) {
      console.error('❌ 통계 데이터 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);

  // 막대 그래프 생성 함수
  const generateBarChart = (data: number[], maxValue: number, color: string = "#93C5FD") => {
    const width = 400;
    const height = 150;
    const barWidth = width / data.length * 0.4; // 0.6에서 0.4로 줄여서 더 얇게
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">통계 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (!statsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">통계 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

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
              <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">User Statistics</p>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">User Growth</h3>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#d4dce2] p-6">
                <p className="text-[#101518] text-base font-medium leading-normal">Daily Users</p>
                <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight truncate">{statsData.users.today}</p>
                <div className="flex gap-1">
                  <p className="text-[#5c758a] text-base font-normal leading-normal">Today</p>
                  <p className="text-[#078838] text-base font-medium leading-normal">
                    {statsData.users.thisWeek > 0 ? `+${Math.round((statsData.users.today / statsData.users.thisWeek) * 100)}%` : '+0%'}
                  </p>
                </div>
                <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                  <svg width="100%" height="148" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    {(() => {
                      const dailyCounts = statsData.users.dailyStats.map(stat => stat.count);
                      const maxCount = Math.max(...dailyCounts, 1);
                      return generateBarChart(dailyCounts, maxCount);
                    })()}
                  </svg>
                  <div className="flex justify-around">
                    {statsData.users.dailyStats.map((stat, index) => {
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
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#d4dce2] p-6">
                <p className="text-[#101518] text-base font-medium leading-normal">Monthly Users</p>
                <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight truncate">{statsData.users.thisMonth}</p>
                <div className="flex gap-1">
                  <p className="text-[#5c758a] text-base font-normal leading-normal">This Month</p>
                  <p className="text-[#078838] text-base font-medium leading-normal">
                    {statsData.users.total > 0 ? `+${Math.round((statsData.users.thisMonth / statsData.users.total) * 100)}%` : '+0%'}
                  </p>
                </div>
                <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                  <svg width="100%" height="148" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    {(() => {
                      const monthlyCounts = statsData.users.monthlyStats.map(stat => stat.count);
                      const maxCount = Math.max(...monthlyCounts, 1);
                      return generateBarChart(monthlyCounts, maxCount, "#86EFAC");
                    })()}
                  </svg>
                  <div className="flex justify-around">
                    {statsData.users.monthlyStats.map((stat, index) => {
                      const [year, month] = stat.month.split('-');
                      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const monthName = monthNames[parseInt(month) - 1];
                      return (
                        <p key={index} className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          {monthName}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Usage Statistics</h3>
            <div className="flex flex-col gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d4dce2]">
                <p className="text-[#101518] text-base font-medium leading-normal">Total Questions Asked</p>
                <p className="text-[#101518] tracking-light text-2xl font-bold leading-tight">{statsData.usage.totalQuestions.toLocaleString()}</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d4dce2]">
                <p className="text-[#101518] text-base font-medium leading-normal">Total Token Usage</p>
                <p className="text-[#101518] tracking-light text-2xl font-bold leading-tight">{statsData.usage.totalTokens.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#d4dce2] p-6">
                <p className="text-[#101518] text-base font-medium leading-normal">Daily Questions</p>
                <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight truncate">
                  {statsData.usage.dailyQuestionStats[statsData.usage.dailyQuestionStats.length - 1]?.count || 0}
                </p>
                <div className="flex gap-1">
                  <p className="text-[#5c758a] text-base font-normal leading-normal">Today</p>
                  <p className="text-[#078838] text-base font-medium leading-normal">
                    {statsData.usage.dailyQuestionStats.length > 1 ? 
                      `+${Math.round(((statsData.usage.dailyQuestionStats[statsData.usage.dailyQuestionStats.length - 1]?.count || 0) / 
                        (statsData.usage.dailyQuestionStats[statsData.usage.dailyQuestionStats.length - 2]?.count || 1)) * 100)}%` : '+0%'}
                  </p>
                </div>
                <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                  <svg width="100%" height="148" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    {(() => {
                      const dailyCounts = statsData.usage.dailyQuestionStats.map(stat => stat.count);
                      const maxCount = Math.max(...dailyCounts, 1);
                      return generateBarChart(dailyCounts, maxCount, "#F59E0B");
                    })()}
                  </svg>
                  <div className="flex justify-around">
                    {statsData.usage.dailyQuestionStats.map((stat, index) => {
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
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#d4dce2] p-6">
                <p className="text-[#101518] text-base font-medium leading-normal">Monthly Questions</p>
                <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight truncate">
                  {statsData.usage.monthlyQuestionStats[statsData.usage.monthlyQuestionStats.length - 1]?.count || 0}
                </p>
                <div className="flex gap-1">
                  <p className="text-[#5c758a] text-base font-normal leading-normal">This Month</p>
                  <p className="text-[#078838] text-base font-medium leading-normal">
                    {statsData.usage.monthlyQuestionStats.length > 1 ? 
                      `+${Math.round(((statsData.usage.monthlyQuestionStats[statsData.usage.monthlyQuestionStats.length - 1]?.count || 0) / 
                        (statsData.usage.monthlyQuestionStats[statsData.usage.monthlyQuestionStats.length - 2]?.count || 1)) * 100)}%` : '+0%'}
                  </p>
                </div>
                <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                  <svg width="100%" height="148" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    {(() => {
                      const monthlyCounts = statsData.usage.monthlyQuestionStats.map(stat => stat.count);
                      const maxCount = Math.max(...monthlyCounts, 1);
                      return generateBarChart(monthlyCounts, maxCount, "#EF4444");
                    })()}
                  </svg>
                  <div className="flex justify-around">
                    {statsData.usage.monthlyQuestionStats.map((stat, index) => {
                      const [year, month] = stat.month.split('-');
                      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const monthName = monthNames[parseInt(month) - 1];
                      return (
                        <p key={index} className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">
                          {monthName}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Questions by AI Model</h3>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#d4dce2] p-6">
                <p className="text-[#101518] text-base font-medium leading-normal">Questions by AI Model</p>
                <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight truncate">{statsData.usage.totalQuestions.toLocaleString()}</p>
                <p className="text-[#5c758a] text-base font-normal leading-normal">All Time</p>
                <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
                  {statsData.usage.modelStats.length > 0 ? (
                    statsData.usage.modelStats.map((model, index) => {
                      const maxQuestions = Math.max(...statsData.usage.modelStats.map(m => m.questionCount), 1);
                      const percentage = (model.questionCount / maxQuestions) * 100;
                      const modelName = model.provider === 'openai' ? 'ChatGPT' : 
                                      model.provider === 'grok' ? 'Grok' : 
                                      model.provider === 'gemini' ? 'Gemini' : 
                                      `${model.provider} - ${model.model}`;
                      
                      return (
                        <React.Fragment key={index}>
                          <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">{modelName}</p>
                          <div className="h-full flex-1">
                            <div 
                              className="border-[#5c758a] bg-[#eaeef1] border-r-2 h-full" 
                              style={{width: `${percentage}%`}}
                            ></div>
                          </div>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center text-[#5c758a] text-sm">
                      아직 사용된 모델이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
