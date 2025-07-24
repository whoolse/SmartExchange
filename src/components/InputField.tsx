import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  error?: boolean;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  error = false,
  disabled = false,
  onBlur
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input === '' || /^\d*\.?\d*$/.test(input)) {
      onChange(input);
    }
  };

  return (
    <div className="amount-input-container">
      <label className="input-label">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        readOnly={disabled}
        className="amount-input"
        onBlur={onBlur}
        style={{
          width: '100%',
          padding: '8px 10px',
          border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
          opacity: disabled ? 0.6 : 1,
        }}
        inputMode="decimal" // открывает цифровую клавиатуру на мобильных
      />
    </div>
  );
};
