"use client";

import { useState } from "react";

export default function ModelManagementPage() {
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
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight">AI Model Management</p>
                <p className="text-[#5c758a] text-sm font-normal leading-normal">
                  Manage AI models, including registration, deletion, and modification. Enter API keys for each model.
                </p>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-[#d4dce2] bg-gray-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-[#101518] w-[400px] text-sm font-medium leading-normal">
                        Model Name
                      </th>
                      <th className="px-4 py-3 text-left text-[#101518] w-[400px] text-sm font-medium leading-normal">API Key</th>
                      <th className="px-4 py-3 text-left text-[#101518] w-60 text-[#5c758a] text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#d4dce2]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#101518] text-sm font-normal leading-normal">ChatGPT</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#5c758a] text-sm font-normal leading-normal">
                        ********************
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-[#5c758a] text-sm font-bold leading-normal tracking-[0.015em]">
                        Edit
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d4dce2]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#101518] text-sm font-normal leading-normal">Grok</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#5c758a] text-sm font-normal leading-normal">
                        ********************
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-[#5c758a] text-sm font-bold leading-normal tracking-[0.015em]">
                        Edit
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#d4dce2]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#101518] text-sm font-normal leading-normal">Gemini</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#5c758a] text-sm font-normal leading-normal">
                        ********************
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-[#5c758a] text-sm font-bold leading-normal tracking-[0.015em]">
                        Edit
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex px-4 py-3 justify-start">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#9cc0de] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Add New Model</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
