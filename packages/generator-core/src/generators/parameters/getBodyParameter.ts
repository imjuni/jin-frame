import type { OpenAPIV3 } from "openapi-types";
import type { IPropertyData } from "#generators/interfaces/IPropertyData.js";
import { getFileUploadKeyMap } from "#generators/octet-stream/getFileUploadKeyMap.js";
import { isFileSchema } from "#generators/octet-stream/isFileSchema.js";
import { getBodyDecorator } from "#generators/parameters/getBodyDecorator.js";
import { getParameterJsDoc } from "#generators/parameters/getParameterJsDoc.js";
import type { IGetBodyParameterProps } from "#generators/parameters/interfaces/IGetBodyParameterProps.js";
import type { IGetBodyParameterResult } from "#generators/parameters/interfaces/IGetBodyParameterResult.js";

export function getBodyParameter(params: IGetBodyParameterProps): IGetBodyParameterResult[] {
  const { requestBody, contentType } = params;

  if (requestBody == null || "$ref" in requestBody || contentType == null || requestBody.content[contentType] == null) {
    return [];
  }

  const mediaType = requestBody.content[contentType];
  const schema = mediaType.schema;
  const schemaDescription =
    schema != null && "description" in schema ? (schema as OpenAPIV3.SchemaObject).description : undefined;
  const requestBodyDescription = [requestBody.description, schemaDescription]
    .filter((desc) => desc != null && desc !== "")
    .join("\n");
  const description = getParameterJsDoc({
    ...requestBody,
    description: requestBodyDescription === "" ? undefined : requestBodyDescription,
  });
  const pathsKey = `NonNullable<paths['${params.pathKey}']['${params.method}']['requestBody']>['content']['${params.contentType}']`;

  if (params.contentType === "application/octet-stream") {
    const fileSchema = isFileSchema(mediaType?.schema);

    if (fileSchema.isFile) {
      const decorators = getBodyDecorator("ObjectBody");
      const property: IPropertyData = {
        decorators,
        docs: description,
        name: "body",
        type: `JinFile`,
        hasDeclareKeyword: true,
        isReadonly: true,
        hasQuestionToken: !(requestBody.required ?? false),
      };

      return [{ decorator: "Body", property }];
    }
  }

  const decorators = getBodyDecorator("ObjectBody");

  if (params.contentType === "multipart/form-data") {
    const fileUploadMap = getFileUploadKeyMap(requestBody);

    // have file upload
    if (fileUploadMap.size > 0) {
      const omitKeys = Array.from(fileUploadMap.keys())
        .map((key) => `'${key}'`)
        .join(" | ");
      const objectBody: IGetBodyParameterResult = {
        decorator: "ObjectBody",
        property: {
          decorators,
          docs: description,
          name: "body",
          type: `Omit<${pathsKey}, ${omitKeys}>`,
          hasDeclareKeyword: true,
          isReadonly: true,
          hasQuestionToken: !(requestBody.required ?? false),
        },
      };

      const bodyDecorators = getBodyDecorator("Body");
      const bodies = Array.from(fileUploadMap.entries()).map(([name, isFile]) => {
        const propertyDescription =
          schema != null && "properties" in schema && schema.properties != null
            ? (schema.properties[name] as OpenAPIV3.SchemaObject | undefined)?.description
            : undefined;
        const body: IGetBodyParameterResult = {
          decorator: "Body",
          property: {
            decorators: bodyDecorators,
            docs: propertyDescription != null ? getParameterJsDoc({ description: propertyDescription }) : description,
            name,
            type: isFile.isArray ? "JinFile[]" : "JinFile",
            hasDeclareKeyword: true,
            isReadonly: true,
            hasQuestionToken: !(requestBody.required ?? false),
          },
        };

        return body;
      });

      return [objectBody, ...bodies];
    }
  }

  const property: IGetBodyParameterResult = {
    decorator: "ObjectBody",
    property: {
      decorators,
      docs: description,
      name: "body",
      type: pathsKey,
      hasDeclareKeyword: true,
      isReadonly: true,
      hasQuestionToken: !(requestBody.required ?? false),
    },
  };

  return [property];
}
