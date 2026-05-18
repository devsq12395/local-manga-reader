import { motion } from "framer-motion";

export function Crossmark({ size = 72, color = "#ef4444" }) {
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
      {/* two lines forming an X */}
      <motion.path
        d="M16 16 L36 36"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: "easeInOut", delay: 0.15 }}
      />
      <motion.path
        d="M36 16 L16 36"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

