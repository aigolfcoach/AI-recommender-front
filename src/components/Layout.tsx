'use client';

import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Layout({ children, className = '', style }: LayoutProps) {
  return (
    <div
      className={`relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden ${className}`}
      style={{
        fontFamily: 'Inter, "Noto Sans", sans-serif',
        ...style
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {children}
      </div>
    </div>
  );
}

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`flex flex-1 justify-center py-5 ${className}`}>
      {children}
    </div>
  );
}

interface ContentContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function ContentContainer({ 
  children, 
  className = '', 
  maxWidth = 'lg' 
}: ContentContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-[480px]',
    md: 'max-w-[640px]',
    lg: 'max-w-[960px]',
    xl: 'max-w-[1200px]',
    '2xl': 'max-w-[1400px]'
  };

  return (
    <div className={`layout-content-container flex flex-col w-full ${maxWidthClasses[maxWidth]} py-5 px-4 ${className}`}>
      {children}
    </div>
  );
}
