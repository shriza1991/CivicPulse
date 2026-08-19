import React, { useState, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../buttons/Button';

export interface OTPInputProps {
  length?: number;
  label?: string;
  onComplete?: (code: string) => void;
  onResend?: () => void;
  resendSecs?: number;
  loading?: boolean;
  error?: string;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  label = 'Enter SMS Verification Code',
  onComplete,
  onResend,
  resendSecs = 30,
  loading = false,
  error,
  className,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.substring(value.length - 1);
    setDigits(newDigits);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join('');
    if (fullCode.length === length) {
      onComplete?.(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d+$/.test(pasted)) {
      const codeDigits = pasted.substring(0, length).split('');
      const updated = [...digits];
      codeDigits.forEach((d, i) => {
        updated[i] = d;
      });
      setDigits(updated);
      inputRefs.current[Math.min(codeDigits.length, length - 1)]?.focus();
      if (updated.join('').length === length) {
        onComplete?.(updated.join(''));
      }
    }
  };

  return (
    <div className={cn('w-full font-sans space-y-3 text-center', className)}>
      <label className="block text-sm font-medium text-neutral-900 select-none">
        {label}
      </label>

      <div className="flex items-center justify-center gap-2">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => { inputRefs.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            disabled={loading}
            className={cn(
              'w-11 h-13 text-center text-xl font-bold font-mono text-neutral-900 bg-white border border-neutral-200 rounded-md transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              error && 'border-danger text-danger'
            )}
          />
        ))}
      </div>

      {error && <p role="alert" className="text-xs font-medium text-danger">{error}</p>}

      {onResend && (
        <div className="pt-2 flex flex-col items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onResend}>
            Resend SMS Code
          </Button>
          <span className="text-[11px] font-mono text-neutral-700">
            Resend cooldown: {resendSecs}s
          </span>
        </div>
      )}
    </div>
  );
};
