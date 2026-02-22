import { motion } from "framer-motion";

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function GlowButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: GlowButtonProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center gap-2 font-heading font-medium rounded-lg transition-all duration-200 cursor-pointer select-none";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary:
      "bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 hover:border-gold/50 hover:shadow-[0_0_20px_#e8b46833]",
    secondary:
      "bg-raised text-txt border border-edge hover:bg-hovered hover:border-edge-2",
    ghost:
      "bg-transparent text-txt-2 border border-transparent hover:text-txt hover:bg-raised",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </motion.button>
  );
}
