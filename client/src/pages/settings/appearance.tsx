import { Separator } from "@/components/ui/separator";
import { AppearanceTheme } from "./components/appearance-theme";

const Appearance = () => {
  return (
    <div className="space-y-6">
      <section
        aria-labelledby="appearance-title"
        className="card-princess spenderella-sparkle p-6"
      >
        <header className="mb-3">
          <h3 id="appearance-title" className="text-xl font-semibold brand-spenderella">
            Appearance
          </h3>
          <p className="text-sm text-muted-foreground">
            Customize the look of <span className="font-medium">Spenderella</span>. 
            Automatically switch between day and night themes.
          </p>
        </header>

        {/* subtle, pretty divider */}
        <Separator className="my-4 bg-[var(--border)]/80" />

        <AppearanceTheme />
      </section>
    </div>
  );
};

export default Appearance;
