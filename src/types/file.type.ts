export interface UploadFileRequest {
  file: File;
  folderPath?: string;
}
export interface UploadFileResponse {
  url: string;
  key: string;
  fileName: string;
  size: number;
}
