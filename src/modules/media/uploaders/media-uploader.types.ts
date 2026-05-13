export type UploadableMediaFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export type UploadMediaOptions = {
  businessId: string;
};

export type UploadedMediaFile = {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
};

export interface MediaUploader {
  upload(
    file: UploadableMediaFile,
    options: UploadMediaOptions,
  ): Promise<UploadedMediaFile>;

  delete(fileUrl: string): Promise<void>;
}
