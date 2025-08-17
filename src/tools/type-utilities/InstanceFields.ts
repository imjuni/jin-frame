type NonFunctionProps<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

// 인스턴스 타입을 받아 필드만
export type InstanceFields<T> = NonFunctionProps<T>;
