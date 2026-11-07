/** Create a status predicate shared by runtime validation and response inference. */
export function validateStatus<const Status extends number = never>(...statuses: Status[]) {
  return (_ok: boolean, status: number): status is Status => statuses.includes(status as Status);
}

export type StatusValidator = (ok: boolean, status: number) => boolean;

export type ValidatedResponse<Response, Validator> = Validator extends ((
  ok: boolean,
  status: number,
) => status is infer Status extends number)
  ? Response extends { status: infer Code extends number }
    ? Code extends Status
      ? Response
      : number extends Code
        ? Response & { status: Status }
        : never
    : never
  : Response;
