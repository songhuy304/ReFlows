"use client";

import { useRef, useState } from "react";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface ProfileAvatarUploadProps {
  avatarUrl?: string;
  fullName?: string;
  onAvatarChange?: (url: string) => void;
  className?: string;
}

export function ProfileAvatarUpload({
  avatarUrl = "",
  fullName = "",
  onAvatarChange,
  className,
}: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(avatarUrl);

  const initials =
    fullName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CN";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onAvatarChange?.(objectUrl);
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-4 lg:w-56 lg:shrink-0 xl:w-64",
        className,
      )}
    >
      <div className="relative">
        <Avatar className="size-28">
          <AvatarImage src={previewUrl} alt={fullName} />
          <AvatarFallback className="bg-primary/15 text-primary text-2xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="border-background absolute right-0 bottom-0 size-8 rounded-full border-2 shadow-sm"
          onClick={() => inputRef.current?.click()}
        >
          <Icons.camera className="size-4" />
          <span className="sr-only">Change profile photo</span>
        </Button>
      </div>

      <Typography
        as="p"
        variant="paragraph-xs"
        className="text-muted-foreground text-center"
      >
        JPG, PNG or GIF. Max size 2MB.
      </Typography>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={() => inputRef.current?.click()}
      >
        <Icons.upload className="size-4" />
        Upload new photo
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
