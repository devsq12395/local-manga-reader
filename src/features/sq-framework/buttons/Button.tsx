import { ButtonHTMLAttributes, FC } from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

// Tailwind base + variants using class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: `bg-colors-btnPrimary text-colors-btnText hover:bg-colors-btnPrimaryHover`,
        primary: `bg-colors-btnPrimary text-colors-btnText hover:bg-colors-btnPrimaryHover`,
        secondary: `bg-colors-btnSecondary text-colors-btnText hover:bg-colors-btnSecondaryHover`,
        danger: `bg-colors-btnDanger text-white hover:bg-colors-btnDangerHover`,
        ghost: `bg-transparent hover:bg-colors-btnGhostHover text-colors-btnText`,
        link: `text-colors-btnTextLink underline-offset-4 hover:underline`,
        circle: `bg-colors-btnCircle text-colors-btnTextCircle hover:bg-colors-btnCircleHover rounded-full p-2`,
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string;
}

// Industry-standard button component
export const Button: FC<ButtonProps> = ({
  children,
  className,
  variant,
  size,
  ...props
}) => {
  return (
    <button
      className={clsx(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;