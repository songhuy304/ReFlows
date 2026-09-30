import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";

interface TeamAvatarProps {
  src?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}
export const TeamAvatar = ({
  src,
  fallback,
  size = "md",
  className,
}: TeamAvatarProps) => {
  const initial = fallback?.slice(0, 2)?.toUpperCase() || "TN";
  return (
    <Avatar
      className={cn(
        "shrink-0 rounded-lg",
        size === "sm" && "size-8",
        size === "md" && "size-10",
        size === "lg" && "size-14",
        className,
      )}
    >
      <AvatarImage src={src} alt="img" />
      <AvatarFallback
        className={cn(
          "rounded-lg font-semibold",
          size === "lg" ? "text-xl" : "text-sm",
        )}
      >
        {initial}
      </AvatarFallback>
    </Avatar>
  );
};
