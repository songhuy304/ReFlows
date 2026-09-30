"use client";

import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";
import { useLocale } from "next-intl";
import { startTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { US, VN } from "country-flag-icons/react/3x2";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useTopLoader } from "nextjs-toploader";

const loader = useTopLoader();
interface LanguageSwitcherProps {
  className?: string;
}

export default function LocaleSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();

  const LocaleConfig: Record<Locale, { label: string; icon: React.ReactNode }> =
    {
      en: { label: "Switch to Vietnamese", icon: <US /> },
      vi: { label: "Chuyển sang tiếng Anh", icon: <VN /> },
    };

  const config = LocaleConfig[locale as Locale];

  const handleChangeLanguage = (newLocale: string) => {
    loader.start();
    const locale = newLocale as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={cn("size-8", className)}
          onClick={() => handleChangeLanguage(locale === "en" ? "vi" : "en")}
          aria-label={config?.label}
        >
          {config?.icon}
        </Button>
      </TooltipTrigger>

      <TooltipContent>Toggle Language</TooltipContent>
    </Tooltip>
  );
}
