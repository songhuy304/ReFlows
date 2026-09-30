"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useStore } from "@tanstack/react-form";

import { FileUploader } from "@/components/file-uploader";
import { FieldDescription, FieldLabel } from "@/components/ui/field";

import {
  useFieldContext,
  FormFieldSet,
  FormField,
  FormFieldError,
  createFormField,
} from "@/components/ui/form-context";

import { useUploadFile } from "@/hooks/use-upload-file";

interface FileUploadFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  maxSize?: number;
  className?: string;
  folderPath?: string;
  disabled?: boolean;
}

export function FileUploadField({
  label,
  description,
  required,
  maxSize,
  className,
  folderPath,
  disabled = false,
}: FileUploadFieldProps) {
  const field = useFieldContext();
  const value = useStore(field.store, (s) => s.value) as string | undefined;
  const { mutateAsync: uploadFile, isPending } = useUploadFile();
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!value) {
      setFiles([]);
    }
  }, [value]);

  const handleValueChange: Dispatch<SetStateAction<File[]>> = (nextValue) => {
    setFiles((prev) => {
      const next = typeof nextValue === "function" ? nextValue(prev) : nextValue;

      if (!next.length) {
        field.handleChange("");
      }

      return next;
    });
  };

  const handlePreviewRemove = () => {
    setFiles([]);
    field.handleChange("");
  };

  const handleUpload = async (uploadFiles: File[]) => {
    if (!uploadFiles.length) {
      field.handleChange("");
      return;
    }

    try {
      const res = await uploadFile({
        file: uploadFiles[0],
        folderPath,
      });

      field.handleChange(res.data.url);
      setFiles([]);
    } catch (error) {
      console.error(error);

      field.handleChange("");
      throw error;
    }
  };

  return (
    <FormFieldSet>
      <FormField>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500"> *</span>}
          </FieldLabel>
        )}

        <div onBlur={field.handleBlur}>
          <FileUploader
            value={files}
            onValueChange={handleValueChange}
            onUpload={handleUpload}
            previewUrl={value}
            onPreviewRemove={handlePreviewRemove}
            maxSize={maxSize}
            className={className}
            disabled={isPending || disabled}
          />
        </div>

        {value && <input type="hidden" value={value} readOnly />}

        {description && <FieldDescription>{description}</FieldDescription>}
      </FormField>

      <FormFieldError />
    </FormFieldSet>
  );
}

export const FormFileUploadField = createFormField(FileUploadField);
