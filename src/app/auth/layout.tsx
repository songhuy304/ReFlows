import { Logo } from "@/components/logo";
import Quote from "@/components/quote";
import { buttonVariants } from "@/components/ui/button";
import { InteractiveGridPattern } from "@/features/auth/components/interactive-grid";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 right-4 hidden md:top-8 md:right-8",
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col p-10 lg:flex dark:border-r">
        <div className="absolute inset-0 bg-sidebar" />
        <Logo />
        <InteractiveGridPattern
          className={cn(
            "mask-[radial-gradient(400px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[0%] h-full skew-y-12",
          )}
        />
        <div className="text-sidebar-foreground relative z-20 mt-auto">
          <Quote />
        </div>
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full min-w-sm max-w-sm flex-col items-center justify-center space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
