import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

// -----------------------------
// Contexts
// -----------------------------
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName }

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

type FormItemContextValue = { id: string }
const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

// -----------------------------
// Hooks
// -----------------------------
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext?.name as string })
  const fieldState = getFieldState(fieldContext?.name as string, formState)

  if (!fieldContext || !fieldContext.name) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

// -----------------------------
// Components
// -----------------------------
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn(
          // Spenderella spacing & subtle container polish
          "grid gap-2 rounded-lg",
          "bg-background/40 dark:bg-input/20 backdrop-blur-[1px]",
          "p-0 sm:p-0", // keep it light by default; customize per form if needed
          className
        )}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      htmlFor={formItemId}
      className={cn(
        // Spenderella typography & glow
        "text-sm font-medium tracking-wide text-foreground/90",
        "transition-colors duration-200",
        "group-focus-within:text-accent-foreground",
        // Error tint
        "data-[error=true]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function FormControl({ className, ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      className={cn(
        // Ensure nested controls pick up the luxe focus ring when focused
        "[&_[data-slot=input],&_[data-slot=textarea],&_[data-slot=select-trigger]]:focus-visible:ring-[3px]",
        "[&_[data-slot=input],&_[data-slot=textarea],&_[data-slot=select-trigger]]:focus-visible:ring-ring/50",
        // Error outline helper
        !!error &&
          "[&_[data-slot=input],&_[data-slot=textarea],&_[data-slot=select-trigger]]:aria-[invalid=true]:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn(
        "text-sm text-muted-foreground",
        // Spenderella: a little air
        "mt-0.5",
        className
      )}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) return null

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn(
        // Clear, accessible error text with gentle motion
        "text-sm text-destructive",
        "animate-in fade-in duration-150",
        className
      )}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
