import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { Heading } from "./heading";
import { Typography } from "./typography";

interface EmptyProps {
  className?: string;
  description?: string;
  title?: string;
  buttonText?: React.ReactNode;
  onButtonClick?: () => void;
}

export function Empty({
  className,
  description,
  title,
  buttonText,
  onButtonClick,
}: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        className
      )}
    >
      <div className="mb-6">
        <Icons.empty className="mx-auto size-28 opacity-80" />
      </div>

      {title && (
        <Typography variant="h4" className="font-semibold tracking-tight">
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="label-sm"
          className="mt-2 max-w-md leading-6 text-muted-foreground"
        >
          {description}
        </Typography>
      )}

      {buttonText && (
        <Button className="mt-6 min-w-36" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}
