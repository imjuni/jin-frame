import type { CE_URL_TEMP_KEY } from "#/tools/const-enum/CE_URL_TEMP_KEY";

export type TCE_URL_TEMP_KEY = (typeof CE_URL_TEMP_KEY)[keyof typeof CE_URL_TEMP_KEY];
