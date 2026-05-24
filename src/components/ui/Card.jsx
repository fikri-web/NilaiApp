"use client";
import { motion } from "framer-motion";

const Screw = () => (
  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#d1d9e6] via-[#f0f2f5] to-[#e0e5ec] border border-[#babecc]/60 shadow-[inset_1px_1px_1px_#ffffff,inset_-1px_-1px_1px_#babecc] flex items-center justify-center pointer-events-none select-none">
    <div className="w-2 h-[1px] bg-[#2d3436]/40 transform rotate-[40deg] rounded-[0.5px]" />
  </div>
);

export default function Card({
  children,
  className = "",
  hasScrews = false,
  liftOnHover = true,
  onClick,
  id,
}) {
  const mechanicalTransition = {
    ease: [0.175, 0.885, 0.32, 1.275],
    duration: 0.25
  };

  const isClickable = !!onClick;

  return (
    <motion.div
      id={id}
      onClick={onClick}
      whileHover={liftOnHover ? {
        y: -3,
        boxShadow: "10px 10px 20px #babecc, -10px -10px 20px #ffffff",
      } : {}}
      transition={mechanicalTransition}
      className={`
        relative rounded-xl bg-[#f0f2f5] border border-[#e0e5ec] p-6 transition-all
        ${hasScrews ? "pt-10 pb-8" : ""}
        ${isClickable ? "cursor-pointer active:scale-[0.99]" : ""}
        ${className}
      `}
      style={{
        boxShadow: "6px 6px 12px #babecc, -6px -6px 12px #ffffff",
      }}
    >
      <span className="absolute inset-[1px] rounded-[11px] border border-t-white/80 border-l-white/60 border-b-transparent border-r-transparent pointer-events-none" />

      {hasScrews && (
        <>
          <div className="absolute top-3.5 left-3.5"><Screw /></div>
          <div className="absolute top-3.5 right-3.5"><Screw /></div>
          <div className="absolute bottom-3.5 left-3.5"><Screw /></div>
          <div className="absolute bottom-3.5 right-3.5"><Screw /></div>
        </>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
