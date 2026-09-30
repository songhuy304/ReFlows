"use client";

import { Icons } from "@/components/icons";
import Image from "next/image";
import * as React from "react";
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from "react-dropzone";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useControllableState } from "@/hooks/use-controllable-state";
import { cn, formatBytes } from "@/lib/utils";
import { Typography } from "./ui/typography";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
  accept?: DropzoneProps["accept"];
  maxSize?: DropzoneProps["maxSize"];
  disabled?: boolean;
  previewUrl?: string;
  onPreviewRemove?: () => void;
}

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = { "image/*": [] },
    maxSize = 1024 * 1024 * 2,
    disabled = false,
    previewUrl,
    onPreviewRemove,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const uploadingFile = files?.[0];
  const hasPreview = !!previewUrl && !uploadingFile;
  const isUploading = !!uploadingFile;

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length > 1) {
        toast.error("Only 1 file can be uploaded at a time");
      }

      const file = acceptedFiles[0];
      if (!file) {
        if (rejectedFiles.length > 0) {
          rejectedFiles.forEach(({ file: rejectedFile }) => {
            toast.error(`File ${rejectedFile.name} was rejected`);
          });
        }
        return;
      }

      const updatedFiles = [file];
      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file: rejectedFile }) => {
          toast.error(`File ${rejectedFile.name} was rejected`);
        });
      }

      if (onUpload) {
        toast.promise(onUpload(updatedFiles), {
          error: "Failed to upload",
        });
      }
    },
    [onUpload, setFiles]
  );

  function handlePreviewRemove(event: React.MouseEvent) {
    event.stopPropagation();
    onPreviewRemove?.();
  }

  return (
    <Dropzone
      onDrop={onDrop}
      accept={accept}
      maxSize={maxSize}
      maxFiles={1}
      multiple={false}
      disabled={disabled}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          className={cn(
            "flex w-full flex-col items-center gap-4 lg:w-56 lg:shrink-0 xl:w-64",
            className
          )}
        >
          <div
            {...getRootProps()}
            className={cn(
              "group relative cursor-pointer rounded-full",
              "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
              disabled && "pointer-events-none opacity-60"
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />

            <Avatar className="size-28 border border-dashed border-muted-foreground/30">
              {previewUrl ? (
                <AvatarImage src={previewUrl} alt="Avatar" />
              ) : (
                <AvatarFallback className="flex flex-col gap-1 bg-transparent group-hover:bg-black/20 transition-all duration-300">
                  {isUploading ? (
                    <Icons.spinner className="size-6 animate-spin" />
                  ) : (
                    <>
                      <Icons.upload className="size-8 text-muted-foreground" />
                    </>
                  )}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Overlay khi đang kéo file vào */}
            {isDragActive ? (
              <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center rounded-full backdrop-blur-sm">
                <Icons.upload
                  className="text-muted-foreground size-6"
                  aria-hidden="true"
                />
              </div>
            ) : null}

            {/* Overlay hover khi đã có ảnh */}
            {hasPreview && !isDragActive ? (
              <div className="absolute inset-0 rounded-full bg-black/0 transition group-hover:bg-black/20" />
            ) : null}

            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="border-background absolute right-0 bottom-0 z-20 size-8 rounded-full border-2 shadow-sm"
              disabled={disabled}
            >
              <Icons.camera className="size-4" />
              <span className="sr-only">Change profile photo</span>
            </Button>
          </div>

          {isUploading ? (
            <div className="space-y-1 text-center">
              <p className="text-foreground/80 line-clamp-1 text-sm font-medium">
                {uploadingFile.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatBytes(uploadingFile.size)}
              </p>
              {progresses?.[uploadingFile.name] ? (
                <Progress
                  value={progresses[uploadingFile.name]}
                  className="w-full max-w-xs"
                />
              ) : null}
            </div>
          ) : (
            <Typography
              as="p"
              variant="paragraph-xs"
              className="text-muted-foreground text-center"
            >
              Upload a file up to {formatBytes(maxSize)}
            </Typography>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() =>
              (
                document.querySelector('input[type="file"]') as HTMLInputElement
              )?.click()
            }
            disabled={disabled}
          >
            <Icons.upload className="size-4" />
            Upload new photo
          </Button>
        </div>
      )}
    </Dropzone>
  );
}
