export default function Login() {
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
              <a className="text-[#101518] text-sm font-medium leading-normal" href="/">Home</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="#">About</a>
              <a className="text-[#101518] text-sm font-medium leading-normal" href="#">Contact</a>
            </div>
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Sign Up</span>
            </button>
          </div>
        </header>
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[480px] py-5 px-4">
            <h2 className="text-[#101518] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Welcome back</h2>
            <div className="flex flex-wrap items-end gap-4 py-3">
              <label className="flex flex-col w-full">
                <p className="text-[#101518] text-base font-medium leading-normal pb-2">User ID</p>
                <input
                  placeholder="Enter your user ID"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c758a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex flex-wrap items-end gap-4 py-3">
              <label className="flex flex-col w-full">
                <p className="text-[#101518] text-base font-medium leading-normal pb-2">Password</p>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] h-14 placeholder:text-[#5c758a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>
            <div className="flex px-4 py-3">
              <a
                href="/user/chat"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#9cc0de] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Sign In</span>
              </a>
            </div>
            <p className="text-[#5c758a] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">Or sign in with</p>
            <div className="flex justify-center">
              <div className="flex flex-1 gap-3 flex-wrap py-3 justify-center">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em] grow"
                >
                  <span className="truncate">Continue with SearchEngineCo</span>
                </button>
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#eaeef1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em] grow"
                >
                  <span className="truncate">Continue with SocialMediaCo</span>
                </button>
              </div>
            </div>
            <p className="text-[#5c758a] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Don't have an account? <a href="/" className="text-[#9cc0de] hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
