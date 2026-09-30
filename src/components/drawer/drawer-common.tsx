import * as React from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button, ButtonProps } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface CommonDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  loading?: boolean;
  hideFooter?: boolean;
  confirmDisabled?: boolean;
  direction?: "left" | "right" | "top" | "bottom";
  cancelButtonProps?: ButtonProps;
  okButtonProps?: ButtonProps;
  className?: {
    container?: string;
    content?: string;
    header?: string;
    footer?: string;
  };
}

export function CommonDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  cancelText = "Cancel",
  confirmText = "Save",
  cancelButtonProps,
  okButtonProps,
  onConfirm,
  loading,
  hideFooter,
  confirmDisabled,
  direction = "right",
  className,
}: CommonDrawerProps) {
  const isMobile = useIsMobile();
  const drawerDirection = isMobile ? "bottom" : direction;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={drawerDirection}>
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <DrawerContent className={className?.container}>
          <DrawerHeader className={className?.header}>
            <DrawerTitle className={cn(!title && "sr-only")}>{title}</DrawerTitle>
            <DrawerDescription className={cn(!description && "sr-only")}>
              {description}
            </DrawerDescription>
          </DrawerHeader>

          <div className={cn("flex-1 overflow-auto px-4")}>{children}</div>

          {!hideFooter && (
            <DrawerFooter className={className?.footer}>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  disabled={cancelButtonProps?.disabled}
                  {...cancelButtonProps}
                >
                  {cancelText}
                </Button>
              </DrawerClose>

              {onConfirm && (
                <Button
                  {...okButtonProps}
                  onClick={onConfirm}
                  isLoading={loading}
                  disabled={confirmDisabled}
                >
                  {confirmText}
                </Button>
              )}
            </DrawerFooter>
          )}
        </DrawerContent>
      )}
    </Drawer>
  );
}
