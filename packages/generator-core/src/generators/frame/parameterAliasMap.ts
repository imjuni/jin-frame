export const parameterAliasMap = {
  Cookie: { aliasName: "FrameCookieParameter", location: "cookie" },
  Header: { aliasName: "FrameHeaderParameter", location: "header" },
  Param: { aliasName: "FramePathParameter", location: "path" },
  Query: { aliasName: "FrameQueryParameter", location: "query" },
} as const;
