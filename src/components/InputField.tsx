// src/components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  readOnly?: boolean;
  error?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  readOnly = false,
  error = false,
}) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      readOnly={readOnly}
      className={`w-full px-2 py-1 rounded border focus:outline-none focus:ring-2 ${error
          ? 'border-red-500 focus:ring-red-300'
          : 'border-gray-300 focus:ring-indigo-300'
        }`}
    />
  </div>
);
