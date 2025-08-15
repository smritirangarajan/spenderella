import { forwardRef } from "react"
import CurrencyInput from "react-currency-input-field"
import { cn } from "@/lib/utils"

interface CurrencyInputFieldProps {
  name: string
  value?: string
  onValueChange?: (value?: string, name?: string) => void
  placeholder?: string
  className?: string
  prefix?: string
  disabled?: boolean
}

const CurrencyInputField = forwardRef<HTMLInputElement, CurrencyInputFieldProps>(
  (
    {
      name,
      value,
      onValueChange,
      placeholder,
      className,
      prefix = "$",
      disabled,
    },
    ref
  ) => {
    return (
      <CurrencyInput
        id={name}
        name={name}
        value={value}
        decimalsLimit={2}
        decimalScale={2}
        prefix={prefix}
        disabled={disabled}
        onValueChange={onValueChange}
        placeholder={placeholder}
        inputMode="decimal"
        // Spenderella styles
        className={cn(
          // Base input styling (keeps your token-driven theme)
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "dark:bg-input/30 border-input bg-transparent text-base md:text-sm",
          "flex h-9 w-full min-w-0 rounded-lg border px-3 py-1 shadow-xs outline-none transition-[color,box-shadow]",
          // Glassy vibe
          "bg-popover/20 backdrop-blur-[1px] dark:bg-popover/10",
          "border-border/60",
          // Premium focus ring
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          // Error affordance (hooked to aria-invalid if passed from parent)
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          // Disabled state
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
      />
    )
  }
)

CurrencyInputField.displayName = "CurrencyInputField"

export default CurrencyInputField
