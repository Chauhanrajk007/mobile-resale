"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      style={{ animation: 'spin 1s linear infinite', width: '20px', height: '20px' }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        style={{ opacity: 0.9 }}
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary": return { background: 'var(--primary)', color: '#fff', border: 'none' };
      case "secondary": return { background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' };
      case "danger": return { background: 'var(--danger)', color: '#fff', border: 'none' };
      case "success": return { background: 'var(--success)', color: '#fff', border: 'none' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm": return { padding: '0.375rem 0.75rem', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)' };
      case "md": return { padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: 'var(--radius)' };
      case "lg": return { padding: '0.75rem 1.5rem', fontSize: '1rem', borderRadius: 'var(--radius)' };
    }
  };

  return (
    <button
      className={className}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: '600',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || loading) ? 0.5 : 1,
        transition: 'all 0.2s',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function Input({ className, style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={className} 
      style={{
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        color: 'var(--text)',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...style
      }}
      {...props} 
    />
  );
}

export function Textarea({ className, style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea 
      className={className} 
      style={{
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        color: 'var(--text)',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...style
      }}
      {...props} 
    />
  );
}

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'block', marginBottom: '1rem' }}>
      <span style={{ 
        display: 'block', 
        marginBottom: '0.5rem', 
        fontSize: '0.75rem', 
        fontWeight: '600', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em', 
        color: 'var(--text2)' 
      }}>
        {label}
        {required && <span style={{ color: 'var(--primary)', marginLeft: '0.25rem' }}>*</span>}
      </span>
      {children}
      {hint && <span style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text2)' }}>{hint}</span>}
    </label>
  );
}

export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "green" | "red" | "amber" | "blue" }) {
  const getToneStyles = () => {
    switch (tone) {
      case "green": return { background: 'rgba(22, 163, 74, 0.1)', color: 'var(--success)', border: '1px solid rgba(22, 163, 74, 0.2)' };
      case "red": return { background: 'rgba(220, 38, 38, 0.1)', color: 'var(--danger)', border: '1px solid rgba(220, 38, 38, 0.2)' };
      case "amber": return { background: 'rgba(202, 138, 4, 0.1)', color: 'var(--warning)', border: '1px solid rgba(202, 138, 4, 0.2)' };
      case "blue": return { background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', border: '1px solid rgba(37, 99, 235, 0.2)' };
      default: return { background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)' };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.125rem 0.625rem',
        borderRadius: '9999px',
        fontSize: '0.6875rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        ...getToneStyles()
      }}
    >
      {children}
    </span>
  );
}
