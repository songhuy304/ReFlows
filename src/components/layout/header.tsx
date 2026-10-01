import { NotificationCenter } from "@/features/notifications/components/notification-center";
import { Breadcrumbs } from "../breadcrumbs";
import LocaleSwitcher from "../locale-switcher";
import SearchInput from "../search-input";
import { ThemeModeToggle } from "../themes/theme-mode-toggle";
import { ThemeSelector } from "../themes/theme-selector";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 group-[variant=floating]:border-b border-transparent px-4 justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4!" />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2 px-4">
        <div className="hidden md:flex">
          <SearchInput />
        </div>
        <ThemeModeToggle />
        <LocaleSwitcher />
        <div className="hidden sm:block">
          <ThemeSelector />
        </div>
        <NotificationCenter />
      </div>
    </header>
  );
}
