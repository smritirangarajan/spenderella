import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type LogoProps = {
  url?: string;
  className?: string;
  imageSrc: string; // Path or URL to your logo image
  alt?: string;
};

const Logo = ({ url, className, imageSrc, alt = "Spenderella Logo" }: LogoProps) => {
  return (
    <Link
      to={url || PROTECTED_ROUTES.OVERVIEW}
      className={cn("flex items-center gap-2 select-none", className)}
      aria-label="Go to overview"
    >
      <div
        className="h-7 w-7 rounded flex items-center justify-center shadow-sm overflow-hidden"
      >
        <img
          src={imageSrc}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>
      <span className="font-semibold text-lg tracking-tight">
        Spenderella
      </span>
    </Link>
  );
};

export default Logo;
