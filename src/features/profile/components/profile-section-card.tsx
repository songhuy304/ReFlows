import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface ProfileSectionCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ProfileSectionCard({
  title,
  description,
  children,
  className,
}: ProfileSectionCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-0">
        <CardTitle>
          <Typography as="h3" variant="label-lg">
            {title}
          </Typography>
        </CardTitle>
        <CardDescription>
          <Typography
            as="p"
            variant="paragraph-sm"
            className="text-muted-foreground"
          >
            {description}
          </Typography>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
