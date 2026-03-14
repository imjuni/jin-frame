import type {
  IFrameOption,
  IQueryFieldOption,
  IHeaderFieldOption,
  IParamFieldOption,
  IBodyFieldOption,
  IObjectBodyFieldOption,
} from 'jin-frame';

/**
 * Data structure for jin-frame code generation
 *
 * This interface represents the complete information needed to generate
 * a jin-frame class from OpenAPI v3 specification. It includes endpoint
 * information, HTTP method configuration, parameters, imports, and
 * inheritance details required for TypeScript code generation.
 */
export interface IJinFrameData {
  /**
   * Frame class name
   */
  name: string;

  /**
   * API endpoint configuration
   * Host and pathPrefix are handled through inheritance.
   * Path contains the path-key from OpenAPI v3 document.
   */
  endpoint: {
    /** API host URL */
    host?: string;
    /** Path prefix from server section */
    pathPrefix?: string;
    /** Path-key from OpenAPI v3 document converted to pathToRegex format */
    path: string;
    /** Original path-key from OpenAPI v3 document */
    originPathKey: string;
  };

  /** Frame type parameter information */
  typeParameters?: {
    /** Type parameter name */
    name: string;
    /** Default value for type parameter */
    default?: string;
  }[];

  /** HTTP method configuration */
  method: {
    /** HTTP method type */
    type: 'Delete' | 'Get' | 'Head' | 'Link' | 'Options' | 'Patch' | 'Post' | 'Purge' | 'Put' | 'Search' | 'Unlink';
    /** Method decorator options */
    arguments?: IFrameOption;
  };

  /** Field parameter configurations for the frame */
  parameters: (
    | {
        type: 'Query';
        arguments: IQueryFieldOption;
      }
    | {
        type: 'Param';
        arguments: IParamFieldOption;
      }
    | {
        type: 'Header';
        arguments: IHeaderFieldOption;
      }
    | {
        type: 'Body';
        arguments: IBodyFieldOption;
      }
    | {
        type: 'ObjectBody';
        arguments: IObjectBodyFieldOption;
      }
  )[];

  /** Import statements required for the generated frame */
  imports: {
    /** Module path to import from */
    moduleSpecifier: string;
    /** Named imports from the module */
    namedImports: string;
  }[];

  /** Base class extension configuration */
  extends: {
    /** Base class name to extend */
    name: string;
    /** Type arguments for the base class */
    typeArgument: string;
  };
}
