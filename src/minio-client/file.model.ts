export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  buffer: Buffer | string;
}

export interface StoredFile extends HasFile, StoredFileMetadata {}

export interface HasFile {
  file: Buffer | string;
}

export interface StoredFileMetadata {
  id: string; // Unique file ID, you might want to store this
  name: string; // Name after hashing
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  updatedAt: Date;
  fileSrc?: string; // This could be the URL to the file
}

export type AppMimeType = 'image/png' | 'image/jpeg';
