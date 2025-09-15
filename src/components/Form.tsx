'use client';

import { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes } from 'react';

// 공통 스타일 클래스들
const inputBaseClasses = "form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border border-[#d4dce2] bg-gray-50 focus:border-[#d4dce2] placeholder:text-[#5c758a] p-[15px] text-base font-normal leading-normal";
const buttonBaseClasses = "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em]";

// Form Field Wrapper
interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

export function FormField({ children, className = '' }: FormFieldProps) {
  return (
    <div className={`flex flex-wrap items-end gap-4 py-3 ${className}`}>
      {children}
    </div>
  );
}

// Label Component
interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

export function Label({ children, htmlFor, className = '' }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`flex flex-col w-full ${className}`}>
      {children}
    </label>
  );
}

// Label Text Component
interface LabelTextProps {
  children: ReactNode;
  className?: string;
}

export function LabelText({ children, className = '' }: LabelTextProps) {
  return (
    <p className={`text-[#101518] text-base font-medium leading-normal pb-2 ${className}`}>
      {children}
    </p>
  );
}

// Input Component
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string;
  variant?: 'default' | 'search';
}

export function Input({ className = '', variant = 'default', ...props }: InputProps) {
  const variantClasses = {
    default: inputBaseClasses + ' h-14',
    search: 'form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101518] focus:outline-0 focus:ring-0 border-none bg-[#eaeef1] focus:border-none h-full placeholder:text-[#5c758a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal'
  };

  return (
    <input
      className={`${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

// Textarea Component
interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  className?: string;
}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`${inputBaseClasses} h-20 ${className}`}
      {...props}
    />
  );
}

// Button Component
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-[#9cc0de] text-[#101518] hover:bg-[#8bb8d4] disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-[#eaeef1] text-[#101518] hover:bg-[#d4dce2] disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'bg-[#5c758a] text-white hover:bg-[#4a5f73] disabled:opacity-50 disabled:cursor-not-allowed'
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const widthClass = fullWidth ? 'flex-1' : '';

  return (
    <button
      className={`${buttonBaseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      <span className="truncate">{children}</span>
    </button>
  );
}

// Checkbox Component
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label?: string;
  className?: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <div className={`px-4 ${className}`}>
      <label className="flex gap-x-3 py-3 flex-row">
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-[#d4dce2] border-2 bg-transparent text-[#9cc0de] checked:bg-[#9cc0de] checked:border-[#9cc0de] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#d4dce2] focus:outline-none"
          {...props}
        />
        {label && (
          <p className="text-[#101518] text-base font-normal leading-normal">
            {label}
          </p>
        )}
      </label>
    </div>
  );
}

// Error Message Component
interface ErrorMessageProps {
  children: ReactNode;
  className?: string;
}

export function ErrorMessage({ children, className = '' }: ErrorMessageProps) {
  return (
    <div className={`mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg ${className}`}>
      {children}
    </div>
  );
}

// Form Group Component
interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormGroup({ children, className = '' }: FormGroupProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
}
