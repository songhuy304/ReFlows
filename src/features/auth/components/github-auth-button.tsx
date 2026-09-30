"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface GithubSignInButtonProps {
  onClick: () => void;
}

export default function GithubSignInButton({
  onClick,
}: GithubSignInButtonProps) {
  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={onClick}
    >
      <Icons.github className="mr-2 h-4 w-4" />
      Continue with Github
    </Button>
  );
}
