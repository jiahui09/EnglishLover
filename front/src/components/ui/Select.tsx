import type { SelectHTMLAttributes } from 'react';
import { useId } from 'react';

import { cn } from '@/lib/cn';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fieldId?: string;
  placeholder?: string;
  options: ReadonlyArray<SelectOption>;
}

export function Select({
  label,
  helperText,
  error,
  fieldId,
  placeholder,
  options,
  className,
  ...props
}: SelectProps) {
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
      <select
        id={id}
        className={cn('el-field__control', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
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
