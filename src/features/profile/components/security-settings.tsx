"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";

import { MOCK_ACTIVE_DEVICES } from "../constants/mock-devices";
import { ChangePasswordForm } from "../forms/change-password-form";
import { ActiveDeviceRow } from "./active-device-row";
import { ProfileSectionCard } from "./profile-section-card";
import { SecurityAccordionItem } from "./security-accordion-item";
import { useTranslations } from "next-intl";

export function SecuritySettings() {
  const t = useTranslations();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <ProfileSectionCard
      title={t("Profile.security")}
      description={t("Profile.description-security")}
    >
      <Accordion type="multiple" className="w-full">
        <SecurityAccordionItem
          value="password"
          icon={Icons.lock}
          iconClassName="bg-secondary text-primary"
          title={t("Profile.change-password.title")}
          description={t("Profile.change-password.description")}
        >
          <ChangePasswordForm />
        </SecurityAccordionItem>

        <SecurityAccordionItem
          value="devices"
          icon={Icons.laptop}
          iconClassName="bg-secondary text-emerald-500"
          title={t("Profile.active-devices.title")}
          description={t("Profile.active-devices.description")}
        >
          <div className="flex flex-col divide-y">
            {MOCK_ACTIVE_DEVICES.map((device) => (
              <ActiveDeviceRow key={device.id} device={device} />
            ))}
          </div>
        </SecurityAccordionItem>
      </Accordion>

      {/* <Separator className="my-2" /> */}

      {/* <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="bg-destructive/15 flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Icons.trash className="text-destructive size-5" />
          </div>
          <div className="min-w-0">
            <Typography as="p" variant="label-sm">
              Delete account
            </Typography>
            <Typography
              as="p"
              variant="paragraph-sm"
              className="text-muted-foreground mt-1"
            >
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </Typography>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 gap-2"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Delete account
          <Icons.chevronRight className="size-4" />
        </Button>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                toast.message("Account deletion is not available yet");
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </ProfileSectionCard>
  );
}
