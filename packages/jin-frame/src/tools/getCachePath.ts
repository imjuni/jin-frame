import type { IGetCachePathParams } from "#interfaces/IGetCachePathParams";

export function getCachePath(params: IGetCachePathParams): string {
  if (params.type === "object-body") {
    const cachePath = "body";
    return cachePath;
  }

  const key = params.replaceAt ?? params.key;
  const cachePath = [params.type, key].join(".");
  return cachePath;
}
