import httpStatusCodes from 'http-status-codes';

export default function isValidateStatusDefault(status: number): boolean {
  return status < httpStatusCodes.BAD_REQUEST;
}
