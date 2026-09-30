import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface SecurityAccordionItemProps {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SecurityAccordionItem({
  value,
  icon: Icon,
  iconClassName,
  title,
  description,
  children,
}: SecurityAccordionItemProps) {
  return (
    <AccordionItem value={value} className="border-b last:border-b-0">
      <AccordionTrigger className="items-start py-5 hover:no-underline">
        <div className="flex flex-1 items-start gap-4 text-left">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              iconClassName,
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 pr-4">
            <Typography as="p" variant="label-sm">
              {title}
            </Typography>
            <Typography
              as="p"
              variant="paragraph-sm"
              className="text-muted-foreground mt-1"
            >
              {description}
            </Typography>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-6">{children}</AccordionContent>
    </AccordionItem>
  );
}
