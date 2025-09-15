'use client';

import { ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
  className?: string;
}

export function Header({ children, className = '' }: HeaderProps) {
  return (
    <header className={`flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaeef1] px-10 py-3 ${className}`}>
      {children}
    </header>
  );
}

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-4 text-[#101518] ${className}`}>
      <div className="size-4">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <h2 className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em]">
        AI Model Recommender
      </h2>
    </div>
  );
}

interface NavigationProps {
  children: ReactNode;
  className?: string;
}

export function Navigation({ children, className = '' }: NavigationProps) {
  return (
    <div className={`flex flex-1 justify-end gap-8 ${className}`}>
      {children}
    </div>
  );
}

interface NavLinksProps {
  children: ReactNode;
  className?: string;
}

export function NavLinks({ children, className = '' }: NavLinksProps) {
  return (
    <div className={`flex items-center gap-9 ${className}`}>
      {children}
    </div>
  );
}

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function NavLink({ href, children, className = '' }: NavLinkProps) {
  return (
    <a 
      href={href} 
      className={`text-[#101518] text-sm font-medium leading-normal ${className}`}
    >
      {children}
    </a>
  );
}

interface UserAvatarProps {
  src?: string;
  onClick?: () => void;
  className?: string;
}

export function UserAvatar({ src, onClick, className = '' }: UserAvatarProps) {
  const defaultAvatar = 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB_K4oCZnObXGSEG0-NXOK_66V9AhGZt1rQjp9fA3Bq9LC_vtDC1lxyptjHHJE1rCpu2PvhhM2WlNACsD5t6fwUAK7igjl881UdEdevunfuzjFwUbxTsRpgSMKC0p74a2rvnGgbUoCSfoZDlsiAgvqd15PDlr_gXDy374YWSklBGsRK1Uxlr59Qoi3IWJO2BhTco7IVLELsrcyGI80caHb2FHjez35yRE6OvMkuB-elDtWRQf11jenV7Wqw_rr6yggAlRKU4CUYcmM")';
  
  return (
    <div
      className={`bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ${className}`}
      style={{
        backgroundImage: src ? `url("${src}")` : defaultAvatar
      }}
      onClick={onClick}
    />
  );
}
