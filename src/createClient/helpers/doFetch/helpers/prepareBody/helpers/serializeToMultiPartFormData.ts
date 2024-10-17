import { isFileData } from "../../../../../../helpers/fileData";

export async function serializeToMultiPartFormData(body: unknown) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(body as any)) {
    if (isFileData(value)) {
      // TODO careful: would this be compatible in non-deno environment?
      const arrayBuffer = await value.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: value.mimeType });
      formData.append(key, blob, value.name);
    } else {
      formData.append(key, value as any);
    }
  }
  return formData;
}
