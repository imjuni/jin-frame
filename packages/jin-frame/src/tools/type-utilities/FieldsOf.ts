// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...a: any[]) => unknown;

// Extracts all keys whose value type includes a function signature.
// Used to distinguish method members from plain data properties.
// 값 타입에 함수 시그니처가 포함된 모든 키를 추출합니다.
// 메서드 멤버와 일반 데이터 프로퍼티를 구분하는 데 사용됩니다.
type FunctionKeys<T> = { [K in keyof T]-?: Extract<T[K], AnyFn> extends never ? never : K }[keyof T];

// Strips all method keys from T, leaving only data properties.
// T에서 모든 메서드 키를 제거하고 데이터 프로퍼티만 남깁니다.
type NonFunctionProps<T> = Omit<T, FunctionKeys<T>>;

// Readonly view of all data properties (methods excluded).
// 모든 데이터 프로퍼티(메서드 제외)의 읽기 전용 뷰입니다.
export type FieldsOf<T> = Readonly<NonFunctionProps<T>>;

// Like FieldsOf but additionally strips keys prefixed with '_'.
// The '_' prefix is the project convention for internal/protected fields
// that should not be part of the public builder or of() API surface.
// FieldsOf와 유사하지만 '_'로 시작하는 키도 추가로 제거합니다.
// '_' 접두사는 빌더 또는 of() API에 노출되지 않아야 하는
// 내부/보호 필드에 대한 프로젝트 컨벤션입니다.
export type PublicFieldsOf<T> = {
  [K in keyof NonFunctionProps<T> as K extends `_${string}` ? never : K]: NonFunctionProps<T>[K];
};
