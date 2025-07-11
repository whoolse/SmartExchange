// src/components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  readOnly?: boolean;
  error?: boolean;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  readOnly = false,
  error = false,
  disabled = false,
}) => (
  <div className="amount-input-container">
    <label className="input-label">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      readOnly={readOnly}
      disabled={disabled}
      className={`amount-input ${error
        ? 'border-red-500 focus:ring-red-300'
        : 'border-gray-300 focus:ring-indigo-300'
        }  ${disabled ? { cursor: 'not-allowed', opacity: 0.6 } : undefined}`}
    />
  </div>
);
