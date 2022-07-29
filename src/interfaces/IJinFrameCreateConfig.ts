import { AxiosRequestConfig } from 'axios';

export default interface IJinFrameCreateConfig extends Pick<AxiosRequestConfig, 'validateStatus'> {}
