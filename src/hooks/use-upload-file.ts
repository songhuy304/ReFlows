import { apiClient } from "@/lib/axios";
import { IResponse } from "@/types/api.type";
import { UploadFileRequest, UploadFileResponse } from "@/types/file.type";
import { useMutation } from "@tanstack/react-query";

export const uploadFile = async (
  data: UploadFileRequest
): Promise<IResponse<UploadFileResponse>> => {
  const formData = new FormData();

  formData.append("file", data.file);

  if (data.folderPath) {
    formData.append("folderPath", data.folderPath);
  }

  return apiClient.post("/upload/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: uploadFile,
  });
};
