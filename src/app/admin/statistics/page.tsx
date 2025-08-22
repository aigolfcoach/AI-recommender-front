"use client";

import { useState } from "react";

export default function StatisticsPage() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    console.log("로그아웃 처리");
    setShowLogoutConfirm(false);
    window.location.href = "/login";
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowLogoutConfirm(false);
    }
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
                <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight truncate">120</p>
                <div className="flex gap-1">
                  <p className="text-[#5c758a] text-base font-normal leading-normal">Today</p>
                  <p className="text-[#078838] text-base font-medium leading-normal">+10%</p>
                </div>
                <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                  <svg width="100%" height="148" viewBox="-3 0 478 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path
                      d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                      fill="url(#paint0_linear_1131_5935)"
                    ></path>
                    <path
                      d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                      stroke="#5c758a"
                      strokeWidth="3"
                      strokeLinecap="round"
                    ></path>
                    <defs>
                      <linearGradient id="paint0_linear_1131_5935" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#eaeef1"></stop>
                        <stop offset="1" stopColor="#eaeef1" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex justify-around">
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Mon</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Tue</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Wed</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Thu</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Fri</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Sat</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Sun</p>
                  </div>
                </div>
              </div>
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#d4dce2] p-6">
                <p className="text-[#101518] text-base font-medium leading-normal">Monthly Users</p>
                <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight truncate">3,500</p>
                <div className="flex gap-1">
                  <p className="text-[#5c758a] text-base font-normal leading-normal">This Month</p>
                  <p className="text-[#078838] text-base font-medium leading-normal">+5%</p>
                </div>
                <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                  <svg width="100%" height="148" viewBox="-3 0 478 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path
                      d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                      fill="url(#paint0_linear_1131_5935)"
                    ></path>
                    <path
                      d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                      stroke="#5c758a"
                      strokeWidth="3"
                      strokeLinecap="round"
                    ></path>
                    <defs>
                      <linearGradient id="paint0_linear_1131_5935" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#eaeef1"></stop>
                        <stop offset="1" stopColor="#eaeef1" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex justify-around">
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Jan</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Feb</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Mar</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Apr</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">May</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Jun</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Jul</p>
                  </div>
                </div>
              </div>
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#d4dce2] p-6">
                <p className="text-[#101518] text-base font-medium leading-normal">Yearly Users</p>
                <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight truncate">42,000</p>
                <div className="flex gap-1">
                  <p className="text-[#5c758a] text-base font-normal leading-normal">This Year</p>
                  <p className="text-[#078838] text-base font-medium leading-normal">+20%</p>
                </div>
                <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                  <svg width="100%" height="148" viewBox="-3 0 478 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path
                      d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                      fill="url(#paint0_linear_1131_5935)"
                    ></path>
                    <path
                      d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                      stroke="#5c758a"
                      strokeWidth="3"
                      strokeLinecap="round"
                    ></path>
                    <defs>
                      <linearGradient id="paint0_linear_1131_5935" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#eaeef1"></stop>
                        <stop offset="1" stopColor="#eaeef1" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex justify-around">
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">2020</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">2021</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">2022</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">2023</p>
                    <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">2024</p>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Usage Statistics</h3>
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d4dce2]">
                <p className="text-[#101518] text-base font-medium leading-normal">Total Questions Asked</p>
                <p className="text-[#101518] tracking-light text-2xl font-bold leading-tight">150,000</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d4dce2]">
                <p className="text-[#101518] text-base font-medium leading-normal">Total Token Usage</p>
                <p className="text-[#101518] tracking-light text-2xl font-bold leading-tight">2,500,000</p>
              </div>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Questions by AI Model</h3>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#d4dce2] p-6">
                <p className="text-[#101518] text-base font-medium leading-normal">Questions by AI Model</p>
                <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight truncate">150,000</p>
                <p className="text-[#5c758a] text-base font-normal leading-normal">All Time</p>
                <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
                  <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Model A</p>
                  <div className="h-full flex-1"><div className="border-[#5c758a] bg-[#eaeef1] border-r-2 h-full" style={{width: '50%'}}></div></div>
                  <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Model B</p>
                  <div className="h-full flex-1"><div className="border-[#5c758a] bg-[#eaeef1] border-r-2 h-full" style={{width: '20%'}}></div></div>
                  <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Model C</p>
                  <div className="h-full flex-1"><div className="border-[#5c758a] bg-[#eaeef1] border-r-2 h-full" style={{width: '100%'}}></div></div>
                  <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Model D</p>
                  <div className="h-full flex-1"><div className="border-[#5c758a] bg-[#eaeef1] border-r-2 h-full" style={{width: '50%'}}></div></div>
                  <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Model E</p>
                  <div className="h-full flex-1"><div className="border-[#5c758a] bg-[#eaeef1] border-r-2 h-full" style={{width: '60%'}}></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
