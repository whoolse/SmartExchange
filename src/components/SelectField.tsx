// src/components/SelectField.tsx
import React from 'react';

interface SelectFieldProps {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    options,
    value,
    onChange,
}) => (
    <label className="block mb-2">
        <span>{label}</span>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="mt-1 block w-full border rounded px-2 py-1"
        >
            {options.map(o => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    </label>
);
