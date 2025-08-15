import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { forwardRef, useEffect } from "react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  [key: string]: string | boolean | undefined;
}

interface GroupOption {
  [key: string]: Option[];
}

interface SingleSelectorProps {
  value?: Option;
  defaultOptions?: Option[];
  options?: Option[];
  placeholder?: string;
  loadingIndicator?: React.ReactNode;
  emptyIndicator?: React.ReactNode;
  delay?: number;
  triggerSearchOnFocus?: boolean;
  onSearch?: (value: string) => Promise<Option[]>;
  onSearchSync?: (value: string) => Option[];
  onChange?: (option: Option) => void;
  disabled?: boolean;
  groupBy?: string;
  className?: string;
  selectFirstItem?: boolean;
  creatable?: boolean;
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    "value" | "placeholder" | "disabled"
  >;
}

export interface SingleSelectorRef {
  selectedValue: Option | undefined;
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}

// debounce
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) return {};
  if (!groupBy) return { "": options };
  const groupOption: GroupOption = {};
  options.forEach((option) => {
    const key = (option[groupBy] as string) || "";
    if (!groupOption[key]) groupOption[key] = [];
    groupOption[key].push(option);
  });
  return groupOption;
}

const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);
  if (!render) return null;
  return (
    <div
      ref={forwardedRef}
      className={cn(
        "py-6 text-center text-sm text-muted-foreground",
        "rounded-md bg-accent/10 mx-2",
        className
      )}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});
CommandEmpty.displayName = "CommandEmpty";

const SingleSelector = React.forwardRef<SingleSelectorRef, SingleSelectorProps>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      onSearchSync,
      loadingIndicator,
      emptyIndicator,
      disabled,
      groupBy,
      className,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
    }: SingleSelectorProps,
    ref: React.Ref<SingleSelectorRef>
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const [open, setOpen] = React.useState(false);
    const [onScrollbar, setOnScrollbar] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [selected, setSelected] = React.useState<Option | undefined>(value);
    const [options, setOptions] = React.useState<GroupOption>(
      transToGroupOption(defaultOptions, groupBy)
    );
    const [inputValue, setInputValue] = React.useState("");
    const [commandValue, setCommandValue] = React.useState("");
    const [showAllOptions, setShowAllOptions] = React.useState(true);
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: selected,
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef?.current?.focus(),
        reset: () => setSelected(undefined),
      }),
      [selected]
    );

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        inputRef.current.blur();
      }
    };

    const handleUnselect = React.useCallback(() => {
      setSelected(undefined);
      onChange?.(undefined as any); // keep API compatibility
      setInputValue("");
      if (arrayOptions) {
        setOptions(transToGroupOption(arrayOptions, groupBy));
      }
    }, [arrayOptions, groupBy, onChange]);

    useEffect(() => {
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchend", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      };
    }, [open]);

    useEffect(() => {
      if (value !== undefined) setSelected(value);
    }, [value]);

    useEffect(() => {
      if (!arrayOptions || onSearch) return;
      const newOption = transToGroupOption(arrayOptions || [], groupBy);
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [defaultOptions, arrayOptions, groupBy, onSearch, options]);

    // sync search
    useEffect(() => {
      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
      };
      const exec = async () => {
        if (!onSearchSync || !open) return;
        if (triggerSearchOnFocus) doSearchSync();
        if (debouncedSearchTerm) doSearchSync();
      };
      void exec();
    }, [
      debouncedSearchTerm,
      groupBy,
      onSearchSync,
      open,
      triggerSearchOnFocus,
    ]);

    // async search
    useEffect(() => {
      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
        setIsLoading(false);
      };
      const exec = async () => {
        if (!onSearch || !open) return;
        if (triggerSearchOnFocus) await doSearch();
        if (debouncedSearchTerm) await doSearch();
      };
      void exec();
    }, [debouncedSearchTerm, groupBy, onSearch, open, triggerSearchOnFocus]);

    const CreatableItem = () => {
      if (!creatable) return undefined;

      // Check if option already exists
      let exists = false;
      Object.values(options).forEach((optGroup) => {
        if (
          optGroup.some(
            (opt) => opt.value === inputValue || opt.label === inputValue
          )
        ) {
          exists = true;
        }
      });

      if (
        exists ||
        (selected &&
          (selected.value === inputValue || selected.label === inputValue))
      ) {
        return undefined;
      }

      const Item = (
        <CommandItem
          value={inputValue}
          className="cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onSelect={(value: string) => {
            const newOption = { value, label: value };
            setSelected(newOption);
            onChange?.(newOption);
            setInputValue("");
            setOpen(false);
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      );

      if (!onSearch && inputValue.length > 0) return Item;
      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) return Item;
      return undefined;
    };

    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined;
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value="-" disabled className="text-muted-foreground">
            {emptyIndicator}
          </CommandItem>
        );
      }
      return (
        <CommandEmpty className="mx-2 rounded-md bg-accent/10">
          {emptyIndicator}
        </CommandEmpty>
      );
    }, [creatable, emptyIndicator, onSearch, options]);

    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) return commandProps.filter;
      if (creatable) {
        return (value: string, search: string) =>
          value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
      }
      return undefined;
    }, [creatable, commandProps?.filter]);

    const openDropdown = () => {
      if (disabled) return;
      setOpen(true);
      setShowAllOptions(true);
      setInputValue("");
      setCommandValue(Math.random().toString());
      if (arrayOptions) setOptions(transToGroupOption(arrayOptions, groupBy));
      inputRef?.current?.focus();
      if (triggerSearchOnFocus) {
        if (onSearch) onSearch("");
        else if (onSearchSync) {
          const res = onSearchSync("");
          setOptions(transToGroupOption(res || [], groupBy));
        }
      }
    };

    return (
      <Command
        ref={dropdownRef}
        {...commandProps}
        value={commandValue}
        className={cn(
          "h-auto overflow-visible bg-transparent",
          commandProps?.className
        )}
        shouldFilter={false}
        filter={commandFilter()}
      >
        {/* Trigger */}
        <div
          className={cn(
            // Spenderella trigger styles
            "flex items-center justify-between rounded-xl border border-input bg-background/80 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background",
            "transition-all duration-200 hover:bg-background/90 hover:shadow-md",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            className
          )}
          onClick={openDropdown}
        >
          {selected ? (
            <div className="flex flex-1 items-center">
              {selected.label}
              {!disabled && (
                <button
                  type="button"
                  className="ml-2 rounded-full p-1 hover:bg-accent/30 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnselect();
                  }}
                  aria-label="Clear selection"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={(value) => {
                setInputValue(value);
                setShowAllOptions(value.length === 0);
                inputProps?.onValueChange?.(value);
              }}
              onBlur={(event) => {
                if (!onScrollbar) setOpen(false);
                inputProps?.onBlur?.(event);
              }}
              onFocus={(event) => {
                setOpen(true);
                if (arrayOptions) {
                  setOptions(transToGroupOption(arrayOptions, groupBy));
                }
                if (triggerSearchOnFocus) {
                  if (onSearch) onSearch("");
                  else if (onSearchSync) {
                    const res = onSearchSync("");
                    setOptions(transToGroupOption(res || [], groupBy));
                  }
                }
                inputProps?.onFocus?.(event);
              }}
              placeholder={placeholder}
              className={cn(
                "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                inputProps?.className
              )}
            />
          )}
          <ChevronsUpDown
            className={cn(
              "h-4 w-4 opacity-60 transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </div>

        {/* Dropdown */}
        <div className="relative">
          {open && (
            <CommandList
              className={cn(
                "absolute top-1 z-10 w-full rounded-xl border border-border/50",
                "bg-popover/90 backdrop-blur-md text-popover-foreground shadow-lg outline-none",
                "divide-y divide-border/40",
                "animate-in fade-in-80 slide-in-from-top-2"
              )}
              onMouseLeave={() => setOnScrollbar(false)}
              onMouseEnter={() => setOnScrollbar(true)}
              onMouseUp={() => {
                inputRef?.current?.focus();
              }}
            >
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {EmptyItem()}
                  {CreatableItem()}
                  {!selectFirstItem && <CommandItem value="-" className="hidden" />}
                  {Object.entries(options).map(([key, dropdowns]) => (
                    <CommandGroup
                      key={key}
                      heading={key}
                      className="h-full overflow-auto"
                      // group heading style
                      headingProps={{
                        className:
                          "px-3 py-1 text-xs font-medium text-muted-foreground/80 uppercase tracking-wide",
                      } as any}
                    >
                      <>
                        {dropdowns
                          .filter(
                            (option) =>
                              showAllOptions ||
                              option.label
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                          )
                          .map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              disabled={option.disable}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onSelect={() => {
                                setInputValue("");
                                setSelected(option);
                                onChange?.(option);
                                setOpen(false);
                              }}
                              className={cn(
                                "cursor-pointer rounded-md px-3 py-2 transition-colors",
                                "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                option.disable &&
                                  "cursor-default text-muted-foreground"
                              )}
                            >
                              {option.label}
                            </CommandItem>
                          ))}
                      </>
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    );
  }
);

SingleSelector.displayName = "SingleSelector";
export { SingleSelector };
