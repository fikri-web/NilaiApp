"use client";
import React from "react";

export default function Input({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  className = "",
  required = false,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-bold uppercase tracking-wider text-[#4a5568] select-none"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-lg overflow-hidden bg-[#d1d9e6]/10">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-3 bg-transparent text-[#2d3436] border border-[#babecc]/30 rounded-lg
            font-sans text-sm outline-none transition-all
            placeholder:text-[#4a5568]/40
            focus:border-[#3b82f6]/40 focus:ring-1 focus:ring-[#3b82f6]/30 focus:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff,0_0_8px_rgba(59,130,246,0.15)]
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          style={{
            boxShadow: "inset 3px 3px 6px #babecc, inset -3px -3px 6px #ffffff",
          }}
          {...props}
        />
        <span className="absolute inset-[1px] rounded-[7px] border border-t-[#babecc]/50 border-l-[#babecc]/30 border-b-transparent border-r-transparent pointer-events-none" />
      </div>
    </div>
  );
}
