import type { AxiosResponse } from 'axios';

export type TJinFrameResponse<TPASS, TFAIL> = AxiosResponse<TPASS> | AxiosResponse<TFAIL>;
