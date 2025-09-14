'use client';

import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className = '' }: ModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl ${className}`}>
        {children}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default',
  isLoading = false
}: ConfirmModalProps) {
  const iconColor = variant === 'danger' ? 'bg-red-500' : 'bg-[#9cc0de]';
  const confirmButtonColor = variant === 'danger' 
    ? 'bg-red-600 text-white hover:bg-red-700' 
    : 'bg-[#9cc0de] text-[#101518] hover:bg-[#8bb8d4]';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center mb-4">
        <div className={`flex-shrink-0 w-10 h-10 ${iconColor} rounded-full flex items-center justify-center mr-3`}>
          {variant === 'danger' ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[#101518]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-semibold text-[#101518]">{title}</h3>
      </div>
      
      <p className="text-[#5c758a] mb-6">{message}</p>
      
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-[#5c758a] bg-[#eaeef1] rounded-lg hover:bg-[#d4dce2] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonColor}`}
        >
          {isLoading ? '처리 중...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = '확인'
}: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#101518]">{title}</h3>
        </div>
        
        <p className="text-[#5c758a] mb-6">{message}</p>
        
        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
}
