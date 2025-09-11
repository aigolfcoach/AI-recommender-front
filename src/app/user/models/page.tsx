export default function ModelsPage() {
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
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight min-w-72">AI Model Descriptions & Token Usage</p>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Model Information</h3>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-lg">
                <div className="flex flex-col gap-1 flex-[2_2_0px]">
                  <p className="text-[#101518] text-base font-bold leading-tight">ChatGPT</p>
                  <p className="text-[#5c758a] text-sm font-normal leading-normal">OpenAI의 대화형 AI 모델로 자연스러운 대화, 창작, 코딩, 분석 등 다양한 작업에 뛰어난 성능을 보입니다.</p>
                </div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-contain rounded-lg flex-1 bg-white border border-gray-200 flex items-center justify-center"
                  style={{
                    backgroundImage: 'url("/models/chatgpt-logo.webp")',
                    backgroundSize: '80%'
                  }}
                ></div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-lg">
                <div className="flex flex-col gap-1 flex-[2_2_0px]">
                  <p className="text-[#101518] text-base font-bold leading-tight">Grok</p>
                  <p className="text-[#5c758a] text-sm font-normal leading-normal">xAI에서 개발한 AI 모델로 실시간 정보 접근과 유머러스한 대화 스타일이 특징이며, 최신 정보를 바탕으로 답변합니다.</p>
                </div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-contain rounded-lg flex-1 bg-white border border-gray-200 flex items-center justify-center"
                  style={{
                    backgroundImage: 'url("/models/grok-logo.png")',
                    backgroundSize: '80%'
                  }}
                ></div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-lg">
                <div className="flex flex-col gap-1 flex-[2_2_0px]">
                  <p className="text-[#101518] text-base font-bold leading-tight">Gemini</p>
                  <p className="text-[#5c758a] text-sm font-normal leading-normal">Google의 멀티모달 AI 모델로 텍스트, 이미지, 오디오를 동시에 처리하며, 창의적 작업과 추론에 특화되어 있습니다.</p>
                </div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-contain rounded-lg flex-1 bg-white border border-gray-200 flex items-center justify-center"
                  style={{
                    backgroundImage: 'url("/models/gemini-logo.jpg")',
                    backgroundSize: '80%'
                  }}
                ></div>
              </div>
            </div>
            <h3 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Token Usage Statistics</h3>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2">
                <p className="text-[#101518] text-base font-medium leading-normal">Token Usage Over Time</p>
                <p className="text-[#101518] tracking-light text-[32px] font-bold leading-tight truncate">15,000</p>
                <div className="flex gap-1">
                  <p className="text-[#5c758a] text-base font-normal leading-normal">Last 30 Days</p>
                  <p className="text-[#078838] text-base font-medium leading-normal">+12%</p>
                </div>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  <div className="border-[#5c758a] bg-[#eaeef1] border-t-2 w-full" style={{height: '50%'}}></div>
                  <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Jan</p>
                  <div className="border-[#5c758a] bg-[#eaeef1] border-t-2 w-full" style={{height: '50%'}}></div>
                  <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Feb</p>
                  <div className="border-[#5c758a] bg-[#eaeef1] border-t-2 w-full" style={{height: '10%'}}></div>
                  <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Mar</p>
                  <div className="border-[#5c758a] bg-[#eaeef1] border-t-2 w-full" style={{height: '100%'}}></div>
                  <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Apr</p>
                  <div className="border-[#5c758a] bg-[#eaeef1] border-t-2 w-full" style={{height: '10%'}}></div>
                  <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">May</p>
                  <div className="border-[#5c758a] bg-[#eaeef1] border-t-2 w-full" style={{height: '40%'}}></div>
                  <p className="text-[#5c758a] text-[13px] font-bold leading-normal tracking-[0.015em]">Jun</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
