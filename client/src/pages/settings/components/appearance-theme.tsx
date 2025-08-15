import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-provider";

type ThemeValue = "light" | "dark" | "system";

export function AppearanceTheme() {
  const { theme, setTheme } = useTheme();

  const initial: ThemeValue = (["light", "dark", "system"] as const).includes(
    theme as ThemeValue
  )
    ? (theme as ThemeValue)
    : "light";

  const [selectedTheme, setSelectedTheme] = useState<ThemeValue>(initial);

  const handleThemeChange = (value: ThemeValue) => setSelectedTheme(value);
  const handleUpdateTheme = () => setTheme(selectedTheme);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium brand-spenderella">Theme</h4>
        <p className="text-sm text-muted-foreground">
          Select how <span className="font-medium">Spenderella</span> looks. Follow your device, or choose light/dark.
        </p>

        {/* Use a responsive grid; prevent overflow */}
        <RadioGroup
          value={selectedTheme}
          onValueChange={handleThemeChange}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-3 place-items-start"
        >
          {/* Light */}
          <div className="w-full min-w-0 max-w-[240px] mx-auto sm:mx-0">
            <RadioGroupItem id="theme-light" value="light" className="sr-only" />
            <Label htmlFor="theme-light" className="cursor-pointer block w-full">
              <div className="card-princess spenderella-sparkle rounded-2xl border-2 border-muted p-1 hover:border-accent focus-within:gilded-focus">
                <div className="space-y-2 rounded-xl bg-[oklch(0.98_0.02_230)] p-2">
                  <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-[oklch(0.92_0.02_240)]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[oklch(0.92_0.02_240)]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[oklch(0.92_0.02_240)]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[oklch(0.92_0.02_240)]" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[oklch(0.92_0.02_240)]" />
                    <div className="h-2 w-[100px] rounded-lg bg-[oklch(0.92_0.02_240)]" />
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center">Light</p>
            </Label>
          </div>

          {/* Dark */}
          <div className="w-full min-w-0 max-w-[240px] mx-auto sm:mx-0">
            <RadioGroupItem id="theme-dark" value="dark" className="sr-only" />
            <Label htmlFor="theme-dark" className="cursor-pointer block w-full">
              <div className="card-princess spenderella-sparkle rounded-2xl border-2 border-muted bg-popover p-1 hover:border-accent focus-within:gilded-focus">
                <div className="space-y-2 rounded-xl bg-slate-950 p-2">
                  <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center">Dark</p>
            </Label>
          </div>

          {/* System */}
          <div className="w-full min-w-0 max-w-[240px] mx-auto sm:mx-0">
            <RadioGroupItem id="theme-system" value="system" className="sr-only" />
            <Label htmlFor="theme-system" className="cursor-pointer block w-full">
              <div className="card-princess spenderella-sparkle rounded-2xl border-2 border-muted p-1 hover:border-accent focus-within:gilded-focus">
                <div className="space-y-2 rounded-xl castle-gradient p-2">
                  <div className="space-y-2 rounded-md bg-white/70 dark:bg-slate-800/70 p-2 shadow-sm">
                    <div className="h-2 w-[80px] rounded-lg bg-[oklch(0.92_0.02_240)] dark:bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-[oklch(0.92_0.02_240)] dark:bg-slate-400" />
                  </div>
                  <div className="flex items-center space-x-2 rounded-md bg-white/70 dark:bg-slate-800/70 p-2 shadow-sm">
                    <div className="h-4 w-4 rounded-full bg-[oklch(0.92_0.02_240)] dark:bg-slate-400" />
                    <div className="h-2 w-[100px] rounded-lg bg-[oklch(0.92_0.02_240)] dark:bg-slate-400" />
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center">System</p>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        type="button"
        onClick={handleUpdateTheme}
        className="btn-princess mt-2 gilded-focus"
      >
        Update preferences
      </Button>
    </div>
  );
}
