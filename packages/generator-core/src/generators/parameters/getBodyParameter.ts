import { getFileUploadKeyMap } from '#/generators/octet-stream/getFileUploadKeyMap';
import { isFileSchema } from '#/generators/octet-stream/isFileSchema';
import { getBodyDecorator } from '#/generators/parameters/getBodyDecorator';
import { getParameterJsDoc } from '#/generators/parameters/getParameterJsDoc';
import type { OpenAPIV3 } from 'openapi-types';
import { StructureKind, Scope, type PropertyDeclarationStructure } from 'ts-morph';

interface IProps {
  method: string;
  pathKey: string;
  contentType?: string;
  requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject;
}

interface IResult {
  decorator: 'Body' | 'ObjectBody';
  property: PropertyDeclarationStructure;
}

export function getBodyParameter(params: IProps): IResult[] {
  const { requestBody, contentType } = params;

  if (requestBody == null || '$ref' in requestBody || contentType == null || requestBody.content[contentType] == null) {
    return [];
  }

  const description = getParameterJsDoc(requestBody);
  const pathsKey = `NonNullable<paths['${params.pathKey}']['${params.method}']['requestBody']>['content']['${params.contentType}']`;

  if (params.contentType === 'application/octet-stream') {
    const mediaType = requestBody?.content?.['application/octet-stream'];
    const fileSchema = isFileSchema(mediaType?.schema);

    if (fileSchema.isFile) {
      const decorators = getBodyDecorator('ObjectBody');
      const property: PropertyDeclarationStructure = {
        decorators,
        docs: description,
        name: 'body',
        type: `JinFile`,
        hasDeclareKeyword: true,
        isReadonly: true,
        hasQuestionToken: requestBody.required ?? false,
        scope: Scope.Public,
        kind: StructureKind.Property,
      };

      return [{ decorator: 'Body', property }];
    }
  }

  const decorators = getBodyDecorator('ObjectBody');

  if (params.contentType === 'multipart/form-data') {
    const fileUploadMap = getFileUploadKeyMap(requestBody);

    // have file upload
    if (fileUploadMap.size > 0) {
      const omitKeys = Array.from(fileUploadMap.keys())
        .map((key) => `'${key}'`)
        .join(' | ');
      const objectBody: IResult = {
        decorator: 'ObjectBody',
        property: {
          decorators,
          docs: description,
          name: 'body',
          type: `Omit<${pathsKey}, ${omitKeys}>`,
          hasDeclareKeyword: true,
          isReadonly: true,
          hasQuestionToken: requestBody.required ?? false,
          scope: Scope.Public,
          kind: StructureKind.Property,
        },
      };

      const bodyDecorators = getBodyDecorator('Body');
      const bodies = Array.from(fileUploadMap.entries()).map(([name, isFile]) => {
        const body: IResult = {
          decorator: 'Body',
          property: {
            decorators: bodyDecorators,
            docs: description,
            name,
            type: isFile.isArray ? 'JinFile[]' : 'JinFile',
            hasDeclareKeyword: true,
            isReadonly: true,
            hasQuestionToken: requestBody.required ?? false,
            scope: Scope.Public,
            kind: StructureKind.Property,
          },
        };

        return body;
      });

      return [objectBody, ...bodies];
    }
  }

  const property: IResult = {
    decorator: 'ObjectBody',
    property: {
      decorators,
      docs: description,
      name: 'body',
      type: pathsKey,
      hasDeclareKeyword: true,
      isReadonly: true,
      hasQuestionToken: requestBody.required ?? false,
      scope: Scope.Public,
      kind: StructureKind.Property,
    },
  };

  return [property];
}
