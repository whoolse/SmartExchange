// src/components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  readOnly = false,
}) => (
  <label className="block mb-2">
    <span>{label}</span>
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      onChange={e => onChange(e.target.value)}
      className={`mt-1 block w-full border rounded px-2 py-1${
        readOnly ? ' bg-gray-50' : ''
      }`}
    />
  </label>
);
