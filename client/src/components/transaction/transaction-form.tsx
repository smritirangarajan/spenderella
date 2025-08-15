import * as z from "zod";
import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import ReceiptScanner from "./receipt-scanner";
import {
  _TRANSACTION_FREQUENCY,
  _TRANSACTION_TYPE,
  CATEGORIES,
  PAYMENT_METHODS,
} from "@/constant";
import { Switch } from "../ui/switch";
import CurrencyInputField from "../ui/current-input";
import { SingleSelector } from "../ui/single-select";
import { AIScanReceiptData } from "@/features/transaction/transactionType";
import {
  useCreateTransactionMutation,
  useGetSingleTransactionQuery,
  useUpdateTransactionMutation,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  type: z.enum([_TRANSACTION_TYPE.INCOME, _TRANSACTION_TYPE.EXPENSE]),
  category: z.string().min(1, { message: "Please select a category." }),
  date: z.date({ required_error: "Please select a date." }),
  paymentMethod: z.string().min(1, { message: "Please select a payment method." }),
  isRecurring: z.boolean(),
  frequency: z
    .enum([
      _TRANSACTION_FREQUENCY.DAILY,
      _TRANSACTION_FREQUENCY.WEEKLY,
      _TRANSACTION_FREQUENCY.MONTHLY,
      _TRANSACTION_FREQUENCY.YEARLY,
    ])
    .nullable()
    .optional(),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionForm = ({
  isEdit = false,
  transactionId,
  onCloseDrawer,
}: {
  isEdit?: boolean;
  transactionId?: string;
  onCloseDrawer?: () => void;
}) => {
  const [isScanning, setIsScanning] = useState(false);

  const { data, isLoading } = useGetSingleTransactionQuery(transactionId || "", {
    skip: !transactionId,
  });
  const editData = data?.transaction;

  const [createTransaction, { isLoading: isCreating }] =
    useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] =
    useUpdateTransactionMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      type: _TRANSACTION_TYPE.INCOME,
      category: "",
      date: new Date(),
      paymentMethod: "",
      isRecurring: false,
      frequency: null,
      description: "",
      receiptUrl: "",
    },
  });

  useEffect(() => {
    if (isEdit && transactionId && editData) {
      form.reset({
        title: editData?.title,
        amount: editData.amount.toString(),
        type: editData.type,
        category: editData.category?.toLowerCase(),
        date: new Date(editData.date),
        paymentMethod: editData.paymentMethod,
        isRecurring: editData.isRecurring,
        frequency: editData.recurringInterval,
        description: editData.description,
      });
    }
  }, [editData, form, isEdit, transactionId]);

  const frequencyOptions = Object.entries(_TRANSACTION_FREQUENCY).map(([, value]) => ({
    value,
    label: value.replace(/_/g, " ").toLowerCase(),
  }));

  const handleScanComplete = (scan: AIScanReceiptData) => {
    form.reset({
      ...form.getValues(),
      title: scan.title || "",
      amount: scan.amount.toString(),
      type: scan.type || _TRANSACTION_TYPE.EXPENSE,
      category: scan.category?.toLowerCase() || "",
      date: new Date(scan.date),
      paymentMethod: scan.paymentMethod || "",
      isRecurring: false,
      frequency: null,
      description: scan.description || "",
      receiptUrl: scan.receiptUrl || "",
    });
  };

  const onSubmit = (values: FormValues) => {
    const payload = {
      title: values.title,
      type: values.type,
      category: values.category,
      paymentMethod: values.paymentMethod,
      description: values.description || "",
      amount: Number(values.amount),
      date: values.date.toISOString(),
      isRecurring: values.isRecurring || false,
      recurringInterval: values.frequency || null,
    };

    if (isEdit && transactionId) {
      updateTransaction({ id: transactionId, transaction: payload })
        .unwrap()
        .then(() => {
          onCloseDrawer?.();
          toast.success("Transaction updated successfully");
        })
        .catch((error) => {
          toast.error(error.data?.message || "Failed to update transaction");
        });
      return;
    }

    createTransaction(payload)
      .unwrap()
      .then(() => {
        form.reset();
        onCloseDrawer?.();
        toast.success("Transaction created successfully");
      })
      .catch((error) => {
        toast.error(error.data?.message || "Failed to create transaction");
      });
  };

  return (
    <div className="relative pb-16 pt-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 px-4"
          aria-busy={isCreating || isUpdating || isLoading}
        >
          <div className="space-y-6">
            {!isEdit && (
              <ReceiptScanner
                loadingChange={isScanning}
                onLoadingChange={setIsScanning}
                onScanComplete={handleScanComplete}
              />
            )}

            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="!font-normal">Transaction Type</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-2"
                    disabled={isScanning}
                  >
                    {[
                      { id: _TRANSACTION_TYPE.INCOME, label: "Income" },
                      { id: _TRANSACTION_TYPE.EXPENSE, label: "Expense" },
                    ].map(({ id, label }) => {
                      const active = field.value === id;
                      return (
                        <label
                          key={id}
                          htmlFor={id}
                          className={cn(
                            "text-sm font-normal cursor-pointer flex items-center gap-2 rounded-lg border p-2.5 flex-1 justify-center transition-colors",
                            "bg-white/60 dark:bg-input/30",
                            active
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-input hover:bg-accent/40"
                          )}
                        >
                          <RadioGroupItem value={id} id={id} />
                          {label}
                        </label>
                      );
                    })}
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!font-normal">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Grocery run, Salary, Rent…" {...field} disabled={isScanning} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!font-normal">Amount</FormLabel>
                  <FormControl>
                    <CurrencyInputField
                      {...field}
                      disabled={isScanning}
                      onValueChange={(val) => field.onChange(val || "")}
                      placeholder="$0.00"
                      prefix="$"
                      aria-label="Amount"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category (SingleSelector) */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!font-normal">Category</FormLabel>
                  <SingleSelector
                    value={
                      CATEGORIES.find((opt) => opt.value === field.value) ||
                      (field.value ? { value: field.value, label: field.value } : undefined)
                    }
                    onChange={(option) => field.onChange(option.value)}
                    options={CATEGORIES}
                    placeholder="Select or type a category"
                    creatable
                    disabled={isScanning}
                    // If SingleSelector wraps react-select, these help ensure it portals above drawer:
                    // @ts-expect-error — only if supported by your component
                    menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                    // @ts-expect-error — only if supported by your component
                    styles={{
                      menuPortal: (base: any) => ({ ...base, zIndex: 70 }),
                      menu: (base: any) => ({ ...base, zIndex: 70 }),
                    }}
                    classNamePrefix="txn-category"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date (Popover) */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="!font-normal">Date</FormLabel>
                  <Popover modal={false}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-between pl-3 font-normal",
                            "bg-white/60 dark:bg-input/30",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-60" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      sideOffset={6}
                      className="z-[70] w-auto p-0 !pointer-events-auto"
                    >
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        disabled={(date) => date < new Date("2023-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method (Select) */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!font-normal">Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined} // Radix prefers undefined over empty string
                    disabled={isScanning}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      position="popper"
                      sideOffset={6}
                      className="z-[70] max-h-64 overflow-auto"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recurring */}
            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 bg-white/50 dark:bg-input/20">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[14.5px] !font-normal">Recurring Transaction</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      {field.value ? "This will repeat automatically" : "Set recurring to repeat this transaction"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isScanning}
                      checked={field.value}
                      className="cursor-pointer"
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        form.setValue("frequency", checked ? _TRANSACTION_FREQUENCY.DAILY : null);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("isRecurring") && (
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!font-normal">Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                      disabled={isScanning}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" className="!capitalize" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        position="popper"
                        sideOffset={6}
                        className="z-[70] max-h-64 overflow-auto"
                      >
                        {frequencyOptions.map(({ value, label }) => (
                          <SelectItem key={value} value={value} className="!capitalize">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!font-normal">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes about this transaction"
                      className="resize-none"
                      disabled={isScanning}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sticky Footer — keep beneath popups; popups use z-[70] */}
          <div className="sticky bottom-0 left-0 right-0 z-20">
            <div className="mx-4 rounded-xl border bg-[rgba(255,255,255,0.75)] dark:bg-background/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur px-4 py-3 shadow-sm">
              <Button
                type="submit"
                className="w-full !text-white"
                disabled={isScanning || isCreating || isUpdating}
              >
                {(isCreating || isUpdating) && <Loader className="mr-1.5 h-4 w-4 animate-spin" />}
                {isEdit ? "Update" : "Save"}
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="absolute inset-0 z-50 grid place-items-center bg-white/70 dark:bg-background/70">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default TransactionForm;
