import PageLayout from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link, Outlet, useLocation } from "react-router-dom";

interface ItemPropsType {
  items: {
    title: string;
    href: string;
  }[];
}

const Settings = () => {
  const sidebarNavItems = [
    { title: "Account", href: PROTECTED_ROUTES.SETTINGS },
    { title: "Appearance", href: PROTECTED_ROUTES.SETTINGS_APPEARANCE },
  ];

  return (
    <PageLayout
  title="Spenderella · Settings"
  subtitle="Polish your profile"
  addMarginTop
>
  <Card className="card-princess spenderella-sparkle border-0 shadow-none">
    <CardContent className="pt-6 pb-8">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>

        <div className="flex-1 lg:max-w-2xl">
          <Outlet />
        </div>
      </div>
    </CardContent>
  </Card>
</PageLayout>

  );
};

function SidebarNav({ items }: ItemPropsType) {
  const { pathname } = useLocation();

  return (
    <nav>
    <div className="sidebar-tiara card-glass rounded-2xl p-3 flex flex-col gap-3">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "w-full justify-start inline-flex items-center text-sm rounded-2xl px-3 py-2 transition-all focus-visible:outline-none gilded-focus",
              active ? "btn-princess" : "btn-outline-rose"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </div>
  </nav>
  
  );
}

export default Settings;
