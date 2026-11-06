import type { IGetFrameResponseTypesProps } from "#generators/content-type/interfaces/IGetFrameResponseTypesProps.js";

export function getFrameResponseTypes(params: IGetFrameResponseTypesProps): string[] {
  const statusResponses = Object.keys(params.responses ?? {})
    .filter((status) => /^[2-5]\d{2}$/.test(status))
    .sort((left, right) => Number(left) - Number(right))
    .map((status) => {
      const response = params.responses?.[status];
      const content = response != null && "content" in response ? response.content : undefined;
      const contentTypes = Object.keys(content ?? {});
      const responsePath = `paths['${params.pathKey}']['${params.method}']['responses'][${status}]`;
      const data =
        contentTypes.length > 0
          ? contentTypes.map((mediaType) => `${responsePath}['content'][${JSON.stringify(mediaType)}]`).join(" | ")
          : "undefined";
      return `{ status: ${status}; data: ${data} }`;
    });
  return statusResponses;
}
