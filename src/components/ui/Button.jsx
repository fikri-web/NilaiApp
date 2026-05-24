"use client";
import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  variant = "primary", // 'primary' | 'secondary' | 'accent' | 'danger'
  type = "button",
  disabled = false,
  className = "",
  id,
}) {
  const mechanicalTransition = {
    ease: [0.175, 0.885, 0.32, 1.275],
    duration: 0.2
  };

  let variantClasses = "";
  if (variant === "primary") {
    // Elegant soft gray raised button
    variantClasses = "bg-[#f0f2f5] text-[#2d3436] border-t-white border-l-white border-b-[#babecc]/80 border-r-[#babecc]/50 hover:bg-[#e6e8eb]";
  } else if (variant === "accent") {
    // Soft educational blue action button
    variantClasses = "bg-[#3b82f6] text-white border-t-white/30 border-l-white/20 border-b-blue-800/80 border-r-blue-800/40 hover:bg-[#2563eb]";
  } else if (variant === "danger") {
    // Soft red alert button
    variantClasses = "bg-[#ef4444] text-white border-t-white/30 border-l-white/20 border-b-red-800/80 border-r-red-800/40 hover:bg-[#dc2626]";
  } else {
    // Secondary: flatter muted style
    variantClasses = "bg-[#e0e5ec]/60 text-[#4a5568] border-transparent hover:bg-[#e0e5ec] hover:text-[#2d3436]";
  }

  return (
    <motion.button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { 
        y: -1.5,
        boxShadow: "10px 10px 20px #babecc, -10px -10px 20px #ffffff",
      }}
      whileTap={disabled ? {} : { 
        y: 1, 
        boxShadow: "inset 5px 5px 10px #babecc, inset -5px -5px 10px #ffffff"
      }}
      transition={mechanicalTransition}
      className={`
        relative px-5 py-2.5 font-bold rounded-lg border text-sm select-none active:scale-[0.98] transition-colors
        ${variantClasses}
        ${disabled ? "opacity-40 cursor-not-allowed shadow-none! pointer-events-none" : "cursor-pointer"}
        ${className}
      `}
      style={{
        boxShadow: variant === "secondary" ? "none" : "6px 6px 12px #babecc, -6px -6px 12px #ffffff",
      }}
    >
      {!disabled && variant !== "secondary" && (
        <span className="absolute inset-[1px] rounded-[7px] border border-t-white/40 border-l-white/20 border-b-transparent border-r-transparent pointer-events-none" />
      )}
      <span className="relative flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
