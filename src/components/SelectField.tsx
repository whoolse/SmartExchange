// src/components/SelectField.tsx
import React from 'react';

interface SelectFieldProps {
    label: string;
    options: string[];
    value: string;
    onChange: (val: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    options,
    value,
    onChange,
}) => (
    <div className="mb-4">
        <label className="block mb-1 font-medium">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
            {options.map(opt => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);
