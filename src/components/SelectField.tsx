// src/components/SelectField.tsx
import React, { useState, useRef, useEffect } from "react";
import { currencies, Currency } from "../constants/constants";
import "./SelectField.css";

interface SelectFieldProps {
    label: string;
    options: string[];        // массив ключей, например ["TON", "USDT"]
    value: string;            // выбранный ключ, например "TON"
    onChange: (val: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    options,
    value,
    onChange,
}) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Получить список валют для селекта
    const selectOptions = options
        .map((key) => {
            const currency = currencies[key];
            if (!currency) return null;
            return {
                key,
                ...currency,
            };
        })
        .filter(Boolean) as Array<{ key: string } & Currency>;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const selected = selectOptions.find(opt => opt.key === value);

    return (
        <div className="dropdownContainer" ref={containerRef}>
            {/* <label className="block mb-1 font-medium">{label}</label> */}
            <div className="selected" onClick={() => setOpen((v) => !v)} tabIndex={0}>
                {selected && (
                    <>
                        <img
                            src={selected.icon}
                            alt={selected.key}
                            className="iconCircle"
                            width={28}
                            height={28}
                            style={{ marginRight: 8, borderRadius: "50%" }}
                        />
                        <span>{selected.key}</span>
                    </>
                )}
                <span className="arrow">▼</span>
            </div>
            {open && (
                <div className="menu">
                    {selectOptions.map(opt => (
                        <div
                            key={opt.key}
                            className={`option${value === opt.key ? " optionActive" : ""}`}
                            onClick={() => {
                                onChange(opt.key);
                                setOpen(false);
                            }}
                        >
                            <img
                                src={opt.icon}
                                alt={opt.key}
                                className="iconCircle"
                                width={28}
                                height={28}
                                style={{ marginRight: 8, borderRadius: "50%" }}
                            />
                            <span>{opt.key}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
