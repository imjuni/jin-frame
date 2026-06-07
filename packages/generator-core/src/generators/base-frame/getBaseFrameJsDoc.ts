import type { ICreateBaseFrameProps } from "#/generators/base-frame/interfaces/ICreateBaseFrameProps";

export function getBaseFrameJsDoc(params: Pick<ICreateBaseFrameProps, "timeout" | "host" | "pathPrefix">): string {
  const endpoint = [params.host ?? "", params.pathPrefix ?? ""].filter((part) => part !== "").join("");
  const endpointDescription = endpoint !== "" ? `\n\nEndpoint: ${endpoint}` : "";

  const defaultTimeout = `Server Host Frame

In most infrastructures, such as Cloudflare, AWS ALB, and Nginx, 
the default timeout value is around 60 seconds. The default timeout 
has been set to 60 seconds.${endpointDescription}`;

  const withTimeout = `Server Host Frame

Timeout ${params.timeout} milliseconds.${endpointDescription}`;

  if (params.timeout != null) {
    return withTimeout;
  }

  return defaultTimeout;
}
