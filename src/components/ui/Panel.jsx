"use client";
import React from "react";

export default function Panel({
  children,
  className = "",
  contentClassName = "",
  variant = "raised", // 'raised' | 'sunken' | 'flat'
  id,
}) {
  const isRaised = variant === "raised";
  const isSunken = variant === "sunken";

  let shadowStyle = {};
  let borderClasses = "";

  if (isRaised) {
    shadowStyle = {
      boxShadow: "6px 6px 12px #babecc, -6px -6px 12px #ffffff",
    };
    borderClasses = "border-t-white/90 border-l-white/60 border-b-[#babecc]/90 border-r-[#babecc]/60";
  } else if (isSunken) {
    shadowStyle = {
      boxShadow: "inset 4px 4px 8px #babecc, inset -4px -4px 8px #ffffff",
    };
    borderClasses = "border-t-[#babecc]/90 border-l-[#babecc]/60 border-b-white/90 border-r-white/60";
  } else {
    borderClasses = "border-[#babecc]/50";
  }

  return (
    <div
      id={id}
      className={`
        bg-[#f0f2f5] border rounded-lg p-6 relative overflow-hidden
        ${borderClasses}
        ${className}
      `}
      style={shadowStyle}
    >
      {isRaised && (
        <span className="absolute inset-[1px] rounded-[7px] border border-t-white/60 border-l-white/30 border-b-transparent border-r-transparent pointer-events-none" />
      )}
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
}
