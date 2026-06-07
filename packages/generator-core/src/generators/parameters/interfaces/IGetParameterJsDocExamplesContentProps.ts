import type { OpenAPIV3 } from "openapi-types";

export interface IGetParameterJsDocExamplesContentProps {
  contentType: string;
  example: OpenAPIV3.ExampleObject;
  options: {
    useCodeFence: boolean;
  };
}
