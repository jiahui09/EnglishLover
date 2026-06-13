import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';

import { cn } from '@/lib/cn';

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export interface InputProps extends NativeInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  fieldId?: string;
}

export function Input({ label, helperText, error, fieldId, className, ...props }: InputProps) {
  const generatedId = useId();
  const id = fieldId ?? generatedId;
  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="el-field">
      {label ? (
        <label className="el-field__label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={cn('el-field__control', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {helperText ? (
        <p id={helperId} className="el-field__helper">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="el-field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
