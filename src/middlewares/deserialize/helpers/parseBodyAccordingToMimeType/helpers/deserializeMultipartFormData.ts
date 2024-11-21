import type { BasePipelineContext } from "../../../../../createPipeline/helpers/types";
import type { FileData } from "../../../../../helpers/fileData";
import { okResult } from "../../../../../helpers/result";

function parseMultipartFormData(formData: FormData) {
  const form: Record<any, any> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const fileData: FileData = {
        arrayBuffer: () => value.arrayBuffer(),
        name: value.name,
        mimeType: value.type,
      };

      form[key] = fileData;
    } else {
      form[key] = value;
    }
  }

  return form;
}

export async function deserializeMultipartFormData(
  context: BasePipelineContext
) {
  const formData = await context.request.readFormData();
  return okResult(parseMultipartFormData(formData));
}
