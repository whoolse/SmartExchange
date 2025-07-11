// src/components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  error?: boolean;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  error = false,
  disabled = false,
}) => (
  <div className="amount-input-container">
    <label className="input-label">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      readOnly={disabled}
      className={`amount-input`}
      style={{
        width: '100%',
        padding: '8px 10px',
        border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
        // cursor: disabled ? 'not-allowed' : 'text',
        opacity: disabled ? 0.6 : 1,
      }}
    />
  </div>
);
