export default function ChatPage() {
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
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/user/chat">Chat</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/user/log">Log</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/user/models">Models</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/user/account">Account</a>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_K4oCZnObXGSEG0-NXOK_66V9AhGZt1rQjp9fA3Bq9LC_vtDC1lxyptjHHJE1rCpu2PvhhM2WlNACsD5t6fwUAK7igjl881UdEdevunfuzjFwUbxTsRpgSMKC0p74a2rvnGgbUoCSfoZDlsiAgvqd15PDlr_gXDy374YWSklBGsRK1Uxlr59Qoi3IWJO2BhTco7IVLELsrcyGI80caHb2FHjez35yRE6OvMkuB-elDtWRQf11jenV7Wqw_rr6yggAlRKU4CUYcmM")'
              }}
            ></div>
          </div>
        </header>
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-64">
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Chat History</h3>
            <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-14">
              <p className="text-[#101518] text-base font-normal leading-normal flex-1 truncate">Chat 1</p>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-14">
              <p className="text-[#101518] text-base font-normal leading-normal flex-1 truncate">Chat 2</p>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-14">
              <p className="text-[#101518] text-base font-normal leading-normal flex-1 truncate">Chat 3</p>
            </div>
          </div>
          
          {/* Chat History와 Chat with AI 사이 세로 구분선 */}
          <div className="w-px bg-[#d4dce2] mx-1"></div>
          
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 ml-2">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">Chat with AI</p>
            </div>


            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">AI Responses</h3>
            <div className="pb-3">
              <div className="flex border-b border-[#d4dce2] px-4 gap-8">
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-[#9cc0de] text-[#101518] pb-[13px] pt-4" href="#">
                  <p className="text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]">Model A</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5c758a] pb-[13px] pt-4" href="#">
                  <p className="text-[#5c758a] text-sm font-bold leading-normal tracking-[0.015em]">Model B</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5c758a] pb-[13px] pt-4" href="#">
                  <p className="text-[#5c758a] text-sm font-bold leading-normal tracking-[0.015em]">Model C</p>
                </a>
              </div>
            </div>
            <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Model A's response to the user's question will appear here. This section will display the AI-generated text, formatted for readability, and potentially include tags
              or metadata about the response.
            </p>
            <div className="flex px-4 py-3 justify-start">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Show Other Models</span>
              </button>
            </div>
            <div className="pb-3">
              <div className="flex border-b border-[#d4dce2] px-4 gap-8">
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5c758a] pb-[13px] pt-4" href="#">
                  <p className="text-[#5c758a] text-sm font-bold leading-normal tracking-[0.015em]">Model A</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-[#9cc0de] text-[#101518] pb-[13px] pt-4" href="#">
                  <p className="text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]">Model B</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5c758a] pb-[13px] pt-4" href="#">
                  <p className="text-[#5c758a] text-sm font-bold leading-normal tracking-[0.015em]">Model C</p>
                </a>
              </div>
            </div>
            <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Model B's response to the user's question will appear here. This section will display the AI-generated text, formatted for readability, and potentially include tags
              or metadata about the response.
            </p>
            <div className="pb-3">
              <div className="flex border-b border-[#d4dce2] px-4 gap-8">
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5c758a] pb-[13px] pt-4" href="#">
                  <p className="text-[#5c758a] text-sm font-bold leading-normal tracking-[0.015em]">Model A</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5c758a] pb-[13px] pt-4" href="#">
                  <p className="text-[#5c758a] text-sm font-bold leading-normal tracking-[0.015em]">Model B</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-[#9cc0de] text-[#101518] pb-[13px] pt-4" href="#">
                  <p className="text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]">Model C</p>
                </a>
              </div>
            </div>
            <p className="text-[#101518] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Model C's response to the user's question will appear here. This section will display the AI-generated text, formatted for readability, and potentially include tags
              or metadata about the response.
            </p>
            
            {/* AI Model Selection을 입력 필드 바로 위에 배치 */}
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">AI Model Selection</h3>
            <div className="flex flex-wrap gap-3 px-4 pb-4">
              <label
                className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-[#d4dce2] px-4 h-11 text-[#101518] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#9cc0de] relative cursor-pointer"
              >
                Automatic (Recommended)
                <input type="radio" className="invisible absolute" name="a2dc9dae-fa7f-47a4-a7fd-6df5f9f3c91c" defaultChecked />
              </label>
              <label
                className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-[#d4dce2] px-4 h-11 text-[#101518] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#9cc0de] relative cursor-pointer"
              >
                Manual
                <input type="radio" className="invisible absolute" name="a2dc9dae-fa7f-47a4-a7fd-6df5f9f3c91c" />
              </label>
            </div>
            
            {/* 입력 필드를 맨 아래로 이동 */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-6">
              <div className="flex-1">
                <input
                  placeholder="Ask me anything..."
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c758a] p-[15px] text-base font-normal leading-normal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
