import { motion } from "framer-motion";

export function Checkmark({ size = 72, color = "#22c55e" }) {
  const R = 24;
  const C = 2 * Math.PI * R;

  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      {/* draw a full circle via two arcs */}
      <motion.path
        d="M26 2
           a24 24 0 1 1 0 48
           a24 24 0 1 1 0 -48"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={C}
        initial={{ strokeDashoffset: C }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <motion.path
        d="M14 27 L23 36 L38 18"
        stroke={color} strokeWidth="4"
        strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.15 }}
      />
    </svg>
  );
}
