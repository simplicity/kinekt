import z from "zod";

export type FileData = {
  arrayBuffer: () => Promise<ArrayBuffer>;
  name: string;
  mimeType: string;
};

export function fileDataSchema() {
  return z
    .custom<FileData>()
    .refine(
      (value) => (value as FileData | undefined)?.arrayBuffer !== undefined,
      {
        message: "Field is required and must be a file",
      }
    );
}

export function isFileData(data: unknown): data is FileData {
  return (data as FileData | undefined)?.arrayBuffer !== undefined;
}

export function createFileData(
  arrayBuffer: ArrayBuffer,
  name: string,
  mimeType: string
): FileData {
  return {
    arrayBuffer: async () => arrayBuffer,
    name,
    mimeType,
  };
}
