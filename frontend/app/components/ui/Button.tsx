import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: `rounded-xl px-8 py-3 bg-gradient-to-r from-[#0ea5e9] to-[#22c55e] text-black text-sm font-bold
              hover:from-[#0284c7] hover:to-[#16a34a] active:scale-95 transition-all duration-200
              shadow-[0_12px_30px_rgba(14,165,233,0.45)] hover:shadow-[0_16px_40px_rgba(14,165,233,0.5)]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`,
    secondary: `rounded-xl px-7 py-3 bg-white text-[#0f172a] text-sm font-semibold border border-black/10
                hover:bg-[#f8fafc] hover:border-[#0ea5e9]/30 hover:shadow-lg active:scale-95
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
    danger: `rounded-xl px-6 py-2.5 bg-white/90 text-[#ef4444] text-sm font-semibold border border-[#ef4444]/20
             hover:bg-[#fef2f2] hover:border-[#ef4444]/40 active:scale-95 transition-all duration-200
             shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`,
  };

  return (
    <button
      className={`${variants[variant]} ${className} ${loading ? 'pointer-events-none opacity-70' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2 justify-center">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}